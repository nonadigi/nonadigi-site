/* Mobile navigation toggle — shared by every page that carries the site nav.
   Adds open/close behavior to the hamburger button (markup: #navToggle,
   panel: #navLinks, state class: "open" on the <nav>). Styling lives in
   css/styles.css; the button only renders at 920px and below. */
(function () {
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (!toggle || !links) return;
  var nav = toggle.closest("nav");
  if (!nav) return;

  function setOpen(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", function () {
    setOpen(!nav.classList.contains("open"));
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
})();
