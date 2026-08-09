/* =========================================================================
   leadership.js — puts the board from data/leadership.json onto the page
   =========================================================================

   TO CHANGE WHO APPEARS ON THE SITE, EDIT  data/leadership.json  — not this
   file. Board members appear in the same order they are listed in that file,
   so to reorder the page, reorder the entries.

   If a board member has no photo yet, their initials are shown in a circle
   instead. A missing photo never leaves a broken image on the page.
   ========================================================================= */

import {
  escapeHtml, safeUrl, initials, loadJson, renderLoadFailure, renderEmpty,
} from "./render.js";

const DATA_FILE = "data/leadership.json";

const ICON_MAIL = `<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/></svg>`;

/**
 * The circular portrait. Falls back to initials, and to a neutral mark for
 * a vacant post. The photo carries alt="" on purpose: the person's name is
 * in the heading directly beneath it, so describing it again would make a
 * screen reader say the name twice.
 */
function portrait(person) {
  const photo = safeUrl(person.photo);
  if (photo) {
    return `<img class="avatar" src="${photo}" alt="" width="88" height="88" loading="lazy">`;
  }
  if (person.vacant) {
    return `<div class="avatar avatar--initials avatar--vacant" aria-hidden="true">--</div>`;
  }
  return `<div class="avatar avatar--initials" aria-hidden="true">${escapeHtml(initials(person.name))}</div>`;
}

/** Build the HTML for one board member card. */
function personCard(person) {
  /* An unfilled post: shown as an invitation rather than hidden away. */
  if (person.vacant) {
    return `<article class="person-card">
        ${portrait(person)}
        <p class="person-card__role">${escapeHtml(person.role || "Officer")}</p>
        <h3 class="person-card__name">Open position</h3>
        <div class="badge-row"><span class="badge badge--vacant">Accepting nominations</span></div>
        <p class="person-card__bio">${escapeHtml(
          person.bio || "This seat on the executive committee is currently open."
        )}</p>
        <p class="person-card__email"><a class="arrow-link" href="get-involved.html">How to stand for office</a></p>
      </article>`;
  }

  const program = [person.program, person.year].filter(Boolean).join(" · ");
  const email = safeUrl(person.email);

  return `<article class="person-card">
      ${portrait(person)}
      <p class="person-card__role">${escapeHtml(person.role || "")}</p>
      <h3 class="person-card__name">${escapeHtml(person.name || "")}</h3>
      ${program ? `<p class="person-card__program">${escapeHtml(program)}</p>` : ""}
      ${person.bio ? `<p class="person-card__bio">${escapeHtml(person.bio)}</p>` : ""}
      ${
        email
          ? `<p class="person-card__email"><a class="arrow-link" href="mailto:${email}">${ICON_MAIL}${escapeHtml(person.email)}</a></p>`
          : ""
      }
    </article>`;
}

async function init() {
  const boardEl = document.querySelector("[data-board]");
  const advisorEl = document.querySelector("[data-advisor]");
  if (!boardEl && !advisorEl) return;

  let data;
  try {
    data = await loadJson(DATA_FILE);
  } catch (error) {
    if (boardEl) renderLoadFailure(boardEl, error, DATA_FILE);
    if (advisorEl) advisorEl.innerHTML = "";
    return;
  }

  /* Board year heading, e.g. "2026–2027 Executive Committee". */
  if (data.boardYear) {
    document.querySelectorAll("[data-board-year]").forEach((node) => {
      node.textContent = data.boardYear;
    });
  }

  if (boardEl) {
    const board = Array.isArray(data.board) ? data.board : [];
    if (!board.length) {
      renderEmpty(boardEl, "Board not listed yet", "The executive committee for this year will be published shortly.");
    } else {
      boardEl.innerHTML = board.map(personCard).join("");
    }
  }

  if (advisorEl) {
    const advisor = data.advisor;
    if (advisor && (advisor.name || advisor.vacant)) {
      advisorEl.innerHTML = personCard(advisor);
    } else {
      const section = advisorEl.closest("section");
      if (section) section.hidden = true;
    }
  }
}

init();
