/**
 * Bimro Tile - Contact Page JavaScript
 * Depends on js/main.js being loaded first (uses the global notify() helper).
 */

document.addEventListener("DOMContentLoaded", function () {
  initContactForm();
});

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const whatsappNumber = form.dataset.whatsappNumber;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = form.elements.name ? form.elements.name.value.trim() : "";
    const phone = form.elements.phone ? form.elements.phone.value.trim() : "";
    const message = form.elements.message ? form.elements.message.value.trim() : "";

    if (!name || !message) {
      notify("Please fill in your name and message before sending.", "error");
      return;
    }

    const lines = ["Hi Bimro Tile, my name is " + name + "."];
    if (phone) lines.push("My contact number is " + phone + ".");
    lines.push(message);

    const waText = encodeURIComponent(lines.join(" "));

    if (form.action && form.action.indexOf("formspree.io") !== -1) {
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      }).catch(function () {
        /* best-effort background record only; WhatsApp redirect below is the primary path */
      });
    }

    window.open("https://wa.me/" + whatsappNumber.replace(/[^\d]/g, "") + "?text=" + waText, "_blank");
    notify("Opening WhatsApp with your message…", "success");
    form.reset();
  });
}
