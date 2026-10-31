/* =========================================================
   AeroTech - shared site JavaScript
   Two interactive elements are implemented here:
     1. Mobile navigation toggle (hamburger button) - JS toggles
        a class, a CSS max-height transition animates it open/closed.
     2. Build-tier selection on the homepage - JS toggles a
        "selected" class, a CSS keyframe animation (glow) plays
        conditionally on the selected card.
   A third small enhancement (Store page "Add to Cart" buttons)
   is included below too, using the same selected/added-class +
   CSS-animation pattern.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. Mobile nav toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navList = document.querySelector(".primary-nav ul");

  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      var isOpen = navList.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.textContent = isOpen ? "Close Menu \u2715" : "Menu \u2630";
    });
  }

  /* ---------- 2. Build-tier selection (homepage only) ---------- */
  var tierCards = document.querySelectorAll(".tier-card");
  if (tierCards.length) {
    tierCards.forEach(function (card) {
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");

      function selectTier() {
        tierCards.forEach(function (c) {
          c.classList.remove("selected");
          c.setAttribute("aria-pressed", "false");
        });
        card.classList.add("selected");
        card.setAttribute("aria-pressed", "true");
      }

      card.addEventListener("click", selectTier);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectTier();
        }
      });
    });
  }

  /* ---------- 3. Add to Cart feedback (store page) ---------- */
  var cartButtons = document.querySelectorAll(".add-to-cart");
  cartButtons.forEach(function (btn) {
    var originalText = btn.textContent;
    btn.addEventListener("click", function () {
      btn.textContent = "Added \u2713";
      btn.classList.add("added");
      setTimeout(function () {
        btn.textContent = originalText;
        btn.classList.remove("added");
      }, 1200);
    });
  });

});
