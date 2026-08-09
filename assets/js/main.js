/* =========================================================================
   main.js — site-wide interface behavior
   =========================================================================

   Deliberately a plain, old-fashioned script (NOT a module) so that it still
   runs when someone opens an .html file straight from their computer by
   double-clicking it. That keeps the menu working even in that situation.

   It does three small things:
     1. Opens and closes the mobile navigation menu
     2. Adds a shadow to the header once the page is scrolled
     3. Fills in the current year in the footer

   Note: which nav link is highlighted as the current page is NOT set here.
   It is written directly into each page's HTML as aria-current="page", so
   it works even with JavaScript switched off.
   ========================================================================= */

(function () {
  "use strict";

  /* -----------------------------------------------------------------
     1. Mobile navigation
     ----------------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.setAttribute("data-open", open ? "true" : "false");
    };

    setOpen(false);

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!isOpen);
    });

    /* Escape closes the menu and returns focus to the button, so keyboard
       users are never stranded inside a menu they cannot dismiss. */
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    /* Tapping anywhere outside the open menu closes it. */
    document.addEventListener("click", function (event) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });

    /* If the window is widened to desktop size while the menu is open,
       reset it so it does not reappear oddly when narrowed again. */
    var desktop = window.matchMedia("(min-width: 62em)");
    var onChange = function (event) {
      if (event.matches) setOpen(false);
    };
    if (desktop.addEventListener) {
      desktop.addEventListener("change", onChange);
    } else if (desktop.addListener) {
      desktop.addListener(onChange); /* older Safari */
    }
  }

  /* -----------------------------------------------------------------
     2. Header shadow on scroll
     ----------------------------------------------------------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var ticking = false;
    var updateHeader = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateHeader);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateHeader();
  }

  /* -----------------------------------------------------------------
     3. Footer year
     ----------------------------------------------------------------- */
  var years = document.querySelectorAll("[data-current-year]");
  for (var i = 0; i < years.length; i++) {
    years[i].textContent = String(new Date().getFullYear());
  }
})();
