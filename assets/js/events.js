/* =========================================================================
   events.js — puts the events from data/events.json onto the page
   =========================================================================

   TO CHANGE WHAT APPEARS ON THE SITE, EDIT  data/events.json  — not this file.

   How it decides what goes where: it compares each event's finish time with
   right now. Anything still to come is listed under Upcoming, oldest first;
   anything finished moves to Past, newest first. Nobody has to move an event
   between two lists by hand — it happens on its own.
   ========================================================================= */

import {
  escapeHtml, safeUrl, parseDate, dateBlockParts, formatWhen, endMoment,
  loadJson, renderLoadFailure, renderEmpty,
} from "./render.js";

const DATA_FILE = "data/events.json";

/* Small inline icons. Marked aria-hidden so screen readers skip the
   decoration and read only the text beside it. */
const ICON_CALENDAR = `<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 11h18"/></svg>`;
const ICON_PIN = `<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>`;
const ICON_SCREEN = `<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>`;
const ICON_ARROW = `<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

/** Build the HTML for one event card. */
function eventCard(event, isPast) {
  const start = parseDate(event.start);
  const end = parseDate(event.end);
  const block = dateBlockParts(start);
  const when = formatWhen(start, end);

  /* Only "planned" gets a badge. Confirmed events need no label. */
  const statusBadge = String(event.status || "").toLowerCase() === "planned"
    ? `<span class="badge badge--planned">Planned</span>`
    : "";

  const committeeBadge = event.committee
    ? `<span class="badge badge--committee">${escapeHtml(event.committee)}</span>`
    : "";

  const badges = statusBadge || committeeBadge
    ? `<div class="badge-row">${statusBadge}${committeeBadge}</div>`
    : "";

  const meta = [];
  meta.push(
    `<li>${ICON_CALENDAR}<time datetime="${escapeHtml(event.start || "")}">${escapeHtml(when)}</time></li>`
  );
  if (event.location) meta.push(`<li>${ICON_PIN}${escapeHtml(event.location)}</li>`);
  if (event.format) meta.push(`<li>${ICON_SCREEN}${escapeHtml(event.format)}</li>`);

  const summary = event.summary
    ? `<p class="event-card__summary">${escapeHtml(event.summary)}</p>`
    : "";

  const link = safeUrl(event.rsvpUrl);
  const action = link && !isPast
    ? `<a class="arrow-link" href="${link}">Details and RSVP${ICON_ARROW}</a>`
    : "";

  return `<article class="event-card${isPast ? " event-card--past" : ""}">
      <div class="event-card__date" aria-hidden="true">
        <span class="event-card__month">${escapeHtml(block.month)}</span>
        <span class="event-card__day">${escapeHtml(block.day)}</span>
        <span class="event-card__year">${escapeHtml(block.year)}</span>
      </div>
      <div>
        ${badges}
        <h3 class="event-card__title">${escapeHtml(event.title || "Untitled event")}</h3>
        <ul class="event-card__meta">${meta.join("")}</ul>
        ${summary}
        ${action}
      </div>
    </article>`;
}

/** Hide a container's whole <section> when there is nothing to show. */
function hideSection(container) {
  const section = container.closest("section");
  if (section) section.hidden = true;
}

async function init() {
  const containers = Array.from(document.querySelectorAll("[data-events]"));
  if (!containers.length) return;

  let data;
  try {
    data = await loadJson(DATA_FILE);
  } catch (error) {
    containers.forEach((container) => renderLoadFailure(container, error, DATA_FILE));
    return;
  }

  const all = Array.isArray(data) ? data : data && data.events;
  if (!Array.isArray(all)) {
    const error = new Error("unexpected shape");
    error.kind = "invalid-json";
    containers.forEach((container) => renderLoadFailure(container, error, DATA_FILE));
    return;
  }

  const now = Date.now();
  const decorated = all.map((event) => {
    const start = parseDate(event.start);
    const end = parseDate(event.end);
    return { event, finishes: endMoment(start, end), starts: start ? start.date.getTime() : 0 };
  });

  const upcoming = decorated
    .filter((item) => item.finishes >= now)
    .sort((a, b) => a.starts - b.starts);

  const past = decorated
    .filter((item) => item.finishes < now)
    .sort((a, b) => b.starts - a.starts);

  containers.forEach((container) => {
    const which = container.getAttribute("data-events");
    const limitAttr = parseInt(container.getAttribute("data-limit") || "", 10);
    const isPast = which === "past";
    let list = isPast ? past : upcoming;

    if (!Number.isNaN(limitAttr)) list = list.slice(0, limitAttr);

    if (!list.length) {
      if (container.hasAttribute("data-hide-when-empty")) {
        hideSection(container);
      } else if (isPast) {
        renderEmpty(container, "Nothing here yet", "Past events will be listed here after they take place.");
      } else {
        renderEmpty(
          container,
          "No events scheduled just now",
          "The chapter is planning its program for the year. Check back soon, or join the mailing list to hear first."
        );
      }
      return;
    }

    container.innerHTML = list.map((item) => eventCard(item.event, isPast)).join("");
  });
}

init();
