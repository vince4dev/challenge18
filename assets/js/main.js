// ==================================================================
//  DOM
// ==================================================================
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
const overlay = document.getElementById("overlay");
const body = document.body;

// ==================================================================
//  Utilities
// ==================================================================
let firstFocusable, lastFocusable;

/* Breakpoint helper – true when < 1440 px */
const isMobileView = () => window.matchMedia("(max-width: 1439px)").matches;

/* Focusable elements that belong to the menu */
const focusableSelectors = [
  "a[href]",
  "button:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
];

/* Focus‑trap helpers */
const getFocusableElements = () =>
  Array.from(navMenu.querySelectorAll(focusableSelectors.join(","))).filter(
    (el) => el.offsetParent !== null,
  );

/* ==================================================================
  Loading
================================================================== */
/* Initialise on load */
document.addEventListener("DOMContentLoaded", () =>
  syncFocusState(!isMobileView()),
);
/* Update on resize */
window.addEventListener("resize", () => syncFocusState(!isMobileView()));

/* ==================================================================
  Overlay
================================================================== */
overlay.addEventListener("click", closeMenu);

/* ==================================================================
  Open / close Menu
================================================================== */
navToggle.addEventListener("click", openMenu);
navClose.addEventListener("click", closeMenu);

/* Open Menu */
function openMenu() {
  navMenu.classList.add("show__menu");
  body.classList.add("menu__open");
  navToggle.setAttribute("aria-expanded", "true");

  /* Focus‑trap only when the menu is actually *opened* */
  if (isMobileView()) syncFocusState(true);

  const focusables = getFocusableElements();
  if (focusables.length) {
    [firstFocusable, lastFocusable] = [focusables[0], focusables.at(-1)];
    firstFocusable.focus();
  }

  document.addEventListener("keydown", trapFocus);
}

/* Close Menu */
function closeMenu() {
  navMenu.classList.remove("show__menu");
  body.classList.remove("menu__open");
  navToggle.setAttribute("aria-expanded", "false");

  /* Focus‑trap only when the menu is actually *closed* */
  if (isMobileView()) syncFocusState(false);

  document.removeEventListener("keydown", trapFocus);
}

/* ==================================================================
  Keyboard focus trap
================================================================== */
function trapFocus(e) {
  if (e.key !== "tab") return;

  const focusables = getFocusableElements();
  if (!focusables.length) {
    e.preventDefault();
    return;
  }

  const isShift = e.shiftKey;

  if (isShift && document.activeElement === firstFocusable) {
    e.preventDefault();
    lastFocusable.focus();
  } else if (!isShift && document.activeElement === lastFocusable) {
    e.preventDefault();
    firstFocusable.focus();
  }
}

/* ==================================================================
  Set focusable state
================================================================== */
function syncFocusState(isOpen) {
  const elements = navMenu.querySelectorAll(focusableSelectors.join(","));
  elements.forEach((el) => {
    el.setAttribute("tabindex", isOpen ? "" : "-1");
  });
}
