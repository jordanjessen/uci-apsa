/* =========================================================================
   render.js — shared helpers for the two data-driven pages
   =========================================================================

   Used by events.js and leadership.js. You should not normally need to edit
   this file to update the website. To change what is ON the site, edit the
   JSON files in the /data/ folder instead.

   A note on times: every event time is displayed in California time
   (America/Los_Angeles), no matter where the person viewing the site is.
   That is deliberate — chapter events happen at UC Irvine, so the time on
   the screen should always match the time on the flyer.
   ========================================================================= */

const TIME_ZONE = "America/Los_Angeles";

const fmtFullDate = new Intl.DateTimeFormat("en-US", {
  weekday: "long", month: "long", day: "numeric", year: "numeric",
  timeZone: TIME_ZONE,
});
const fmtTime = new Intl.DateTimeFormat("en-US", {
  hour: "numeric", minute: "2-digit", timeZone: TIME_ZONE,
});
const fmtMonthShort = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: TIME_ZONE });
const fmtDayNum    = new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: TIME_ZONE });
const fmtYear      = new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: TIME_ZONE });
const fmtISODay    = new Intl.DateTimeFormat("en-CA", {
  year: "numeric", month: "2-digit", day: "2-digit", timeZone: TIME_ZONE,
});

/* -------------------------------------------------------------------------
   Text safety
   ------------------------------------------------------------------------- */

/** Escape text so that characters like < and & cannot break the page. */
export function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Allow only ordinary link types. Anything unexpected becomes an empty
 * string rather than a live link, so a mistyped or pasted-in URL cannot
 * run code on the page.
 */
export function safeUrl(value) {
  if (!value) return "";
  const raw = String(value).trim();
  if (!raw) return "";
  if (/^(https?:|mailto:)/i.test(raw)) return escapeHtml(raw);
  /* Relative paths such as assets/img/board/name.jpg */
  if (/^[\w./-]+$/.test(raw) && !/^\/\//.test(raw)) return escapeHtml(raw);
  return "";
}

/* -------------------------------------------------------------------------
   Dates
   ------------------------------------------------------------------------- */

/**
 * Turn a date string from the JSON into a Date object.
 * Accepts either "2027-05-21" (no time) or "2027-05-21T13:00:00-07:00".
 * Returns null if the value is missing or unreadable.
 */
export function parseDate(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const raw = value.trim();

  /* A plain date with no time. JavaScript reads these as UTC midnight,
     which can render as the previous day in California, so we anchor them
     at midday UTC instead — that lands on the correct calendar date
     everywhere in the world. */
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (dateOnly) {
    const date = new Date(Date.UTC(+dateOnly[1], +dateOnly[2] - 1, +dateOnly[3], 12, 0, 0));
    return isNaN(date.getTime()) ? null : { date, hasTime: false };
  }

  const date = new Date(raw);
  if (isNaN(date.getTime())) return null;
  return { date, hasTime: true };
}

/** The month / day / year pieces used by the little date block on a card. */
export function dateBlockParts(parsed) {
  if (!parsed) return { month: "TBD", day: "--", year: "" };
  return {
    month: fmtMonthShort.format(parsed.date),
    day: fmtDayNum.format(parsed.date),
    year: fmtYear.format(parsed.date),
  };
}

/** A readable date line, e.g. "Wednesday, October 21, 2026 · 5:30 PM – 7:00 PM". */
export function formatWhen(start, end) {
  if (!start) return "Date to be announced";

  const sameDay = end && fmtISODay.format(start.date) === fmtISODay.format(end.date);

  /* Multi-day event: show both dates and no clock times. */
  if (end && !sameDay) {
    return `${fmtFullDate.format(start.date)} – ${fmtFullDate.format(end.date)}`;
  }

  const day = fmtFullDate.format(start.date);
  if (!start.hasTime) return day;

  const time = end && sameDay
    ? `${fmtTime.format(start.date)} – ${fmtTime.format(end.date)}`
    : fmtTime.format(start.date);

  return `${day} · ${time}`;
}

/** The moment an event is considered finished. */
export function endMoment(start, end) {
  if (end) return end.date.getTime();
  if (start) return start.date.getTime();
  return 0;
}

/* -------------------------------------------------------------------------
   People
   ------------------------------------------------------------------------- */

/* Degrees and suffixes are not part of a person's initials. Without this,
   "Edwin S. Monuki, M.D., Ph.D." would come out as "EP" rather than "EM". */
const CREDENTIAL = /^(?:m\.?d|ph\.?d|d\.?o|d\.?d\.?s|d\.?v\.?m|m\.?s|m\.?a|m\.?p\.?h|m\.?b\.?a|b\.?a|b\.?s|r\.?n|n\.?p|p\.?a|pharm\.?d|j\.?d|esq|jr|sr|ii|iii|iv)\.?$/i;

/** First letter of a word, ignoring any punctuation around it. */
function firstLetter(word) {
  const m = word.match(/[A-Za-z]/);
  return m ? m[0] : "";
}

/** "Jordan Jessen" -> "JJ". Used when a board member has no photo yet. */
export function initials(name) {
  if (!name) return "?";
  const words = String(name).trim().split(/\s+/)
    .map((w) => w.replace(/,+$/, ""))
    .filter(Boolean);
  if (!words.length) return "?";
  // Drop degrees, but never end up with nothing to show.
  const named = words.filter((w) => !CREDENTIAL.test(w));
  const parts = named.length ? named : words;
  const first = firstLetter(parts[0]);
  const last = parts.length > 1 ? firstLetter(parts[parts.length - 1]) : "";
  return (first + last).toUpperCase() || "?";
}

/* -------------------------------------------------------------------------
   Loading data
   ------------------------------------------------------------------------- */

/**
 * Read one of the JSON files in /data/.
 * Throws an Error carrying a `kind` so the caller can explain what happened
 * in plain language.
 */
export async function loadJson(path) {
  let response;
  try {
    response = await fetch(path, { cache: "no-cache" });
  } catch (cause) {
    const error = new Error(`Could not reach ${path}`);
    error.kind = window.location.protocol === "file:" ? "file-protocol" : "network";
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`${path} responded with ${response.status}`);
    error.kind = response.status === 404 ? "missing" : "network";
    throw error;
  }

  try {
    return await response.json();
  } catch (cause) {
    const error = new Error(`${path} is not valid JSON`);
    error.kind = "invalid-json";
    error.detail = cause && cause.message ? cause.message : "";
    throw error;
  }
}

/**
 * Replace a container's contents with a plain-language explanation of why
 * the data did not load. Never leaves a blank hole in the page.
 */
export function renderLoadFailure(container, error, fileName) {
  const kind = (error && error.kind) || "network";
  const onFile = window.location.protocol === "file:";
  let body;

  if (kind === "file-protocol" || onFile) {
    body = `
      <p><strong>This section needs a local preview server.</strong></p>
      <p>You have opened this page as a file on your computer, and browsers
         block pages opened that way from reading data files such as
         <code>${escapeHtml(fileName)}</code>.</p>
      <p>To preview on your own machine, open Terminal in the website folder
         and run <code>python3 -m http.server 8000</code>, then visit
         <code>http://localhost:8000</code>. Full instructions are in
         <code>README.md</code>.</p>
      <p><strong>Nothing is broken.</strong> This section displays normally on
         the published website.</p>`;
  } else if (kind === "invalid-json") {
    body = `
      <p><strong>There is a typo in <code>${escapeHtml(fileName)}</code>.</strong></p>
      <p>The file could not be read as JSON. The usual causes are a missing
         comma between entries, an extra comma after the final entry, or a
         missing quotation mark.</p>
      <p>Open the file on GitHub — it highlights the offending line — or paste
         its contents into a JSON checker. Your last commit can be undone from
         the file's History tab.</p>`;
  } else if (kind === "missing") {
    body = `
      <p><strong><code>${escapeHtml(fileName)}</code> could not be found.</strong></p>
      <p>Check that the file still exists in the <code>data</code> folder and
         that its name has not been changed.</p>`;
  } else {
    body = `
      <p><strong>This section could not be loaded.</strong></p>
      <p>Please refresh the page. If the problem continues, check that
         <code>${escapeHtml(fileName)}</code> is present and valid.</p>`;
  }

  container.innerHTML = `<div class="notice" role="status">
      <svg class="icon notice__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M12 8h.01M11 12h1v4h1"></path>
      </svg>
      <div>${body}</div>
    </div>`;
}

/** Friendly placeholder when a list is legitimately empty. */
export function renderEmpty(container, title, message) {
  container.innerHTML = `<div class="empty-state">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(message)}</p>
    </div>`;
}
