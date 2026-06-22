/**
 * Bimro Tile - Branches Page JavaScript
 * Depends on js/main.js being loaded first (uses the global notify() helper).
 */

document.addEventListener("DOMContentLoaded", function () {
  if (!document.querySelector("[data-branch-card]")) return;
  updateOpenStatus();
  initBranchSearch();
  initBranchActionFeedback();
  setInterval(updateOpenStatus, 60000);
});

function isOpenNow(openTime, closeTime) {
  const now = new Date();
  const openParts = openTime.split(":").map(Number);
  const closeParts = closeTime.split(":").map(Number);
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  return minutesNow >= openParts[0] * 60 + openParts[1] && minutesNow < closeParts[0] * 60 + closeParts[1];
}

function updateOpenStatus() {
  document.querySelectorAll("[data-branch-status]").forEach(function (badge) {
    const open = isOpenNow(badge.dataset.openTime, badge.dataset.closeTime);
    badge.textContent = open ? "Open now" : "Closed now";
    badge.classList.toggle("is-open", open);
    badge.classList.toggle("is-closed", !open);
  });
}

function initBranchSearch() {
  const input = document.querySelector("[data-branch-search]");
  const cards = Array.from(document.querySelectorAll("[data-branch-card]"));
  const emptyState = document.querySelector("[data-branch-empty]");
  if (!input || !cards.length) return;

  input.addEventListener("input", function () {
    const query = input.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(function (card) {
      const haystack = card.dataset.branchSearchText || "";
      const matches = haystack.includes(query);
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount !== 0;
  });

  document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
      event.preventDefault();
      input.focus();
    }
  });
}

function initBranchActionFeedback() {
  document.querySelectorAll("[data-notify-on-click]").forEach(function (link) {
    link.addEventListener("click", function () {
      notify(link.dataset.notifyOnClick, "success");
    });
  });
}
