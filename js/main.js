/**
 * Bimro Tile - Global JavaScript
 * Plain script, no build step, no ES modules. Loaded on every page.
 */

document.addEventListener("DOMContentLoaded", function () {
  initHeaderScroll();
  initMobileMenu();
  initScrollReveal();
});

/**
 * Header background/shadow change on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/**
 * Mobile off-canvas menu toggle
 */
function initMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");
  if (!toggle || !nav) return;

  function close() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.documentElement.style.overflow = "";
  }

  function open() {
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.documentElement.style.overflow = "hidden";
  }

  toggle.addEventListener("click", function () {
    nav.classList.contains("is-open") ? close() : open();
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", close);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") close();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 992) close();
  });
}

/**
 * Fade/slide in elements marked with [data-reveal] or [data-reveal-group] as they scroll into view
 */
function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal], [data-reveal-group]");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (el) {
      el.classList.add("is-revealed");
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
}

/**
 * Small toast notification, used by the branches and contact pages
 */
let toastContainer;

function getToastContainer() {
  if (toastContainer) return toastContainer;
  toastContainer = document.createElement("div");
  toastContainer.className = "toast-container";
  toastContainer.setAttribute("aria-live", "polite");
  document.body.appendChild(toastContainer);
  return toastContainer;
}

function notify(message, type, duration) {
  type = type || "info";
  duration = duration || 3200;

  const toast = document.createElement("div");
  toast.className = "toast toast-" + type;
  toast.textContent = message;
  getToastContainer().appendChild(toast);

  requestAnimationFrame(function () {
    toast.classList.add("is-visible");
  });

  setTimeout(function () {
    toast.classList.remove("is-visible");
    toast.addEventListener("transitionend", function () {
      toast.remove();
    }, { once: true });
  }, duration);
}
