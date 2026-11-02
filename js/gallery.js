/* =========================================================
   gallery.js - photo gallery with a lightbox (About page)

   Clicking a small picture opens a "lightbox": a dark overlay that
   shows the picture in a larger view. The visitor can move to the
   previous / next picture or close the lightbox.

   Without JavaScript each thumbnail is still a normal link to the
   full-size picture, so the gallery always works.

   1. Build the lightbox (created with JavaScript and added to the page)
   2. Functions to show, open and close the lightbox
   3. Mouse and keyboard controls
   ========================================================= */

const galleryLinks = document.querySelectorAll(".gallery a");

if (galleryLinks.length > 0) {
  let currentIndex = 0;    // which picture is showing
  let lastFocused = null;  // the thumbnail to return to after closing

  // ---------- 1. Build the lightbox ----------
  // makeElement() is defined in main.js
  const lightbox = makeElement("div", "", "lightbox");
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Picture viewer");

  const closeButton = makeElement("button", "×", "lightbox-close");
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close picture viewer");

  const previousButton = makeElement("button", "‹", "lightbox-prev");
  previousButton.type = "button";
  previousButton.setAttribute("aria-label", "Previous picture");

  const nextButton = makeElement("button", "›", "lightbox-next");
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", "Next picture");

  const largeImage = document.createElement("img");
  const caption = makeElement("p", "", "lightbox-caption");

  lightbox.append(closeButton, previousButton, largeImage, nextButton, caption);
  document.body.appendChild(lightbox);


  // ---------- 2. Show, open and close ----------

  // Shows the picture at position "index" in the gallery
  function showPicture(index) {
    // Wrap around: after the last picture comes the first, and the other way round
    currentIndex = (index + galleryLinks.length) % galleryLinks.length;

    const link = galleryLinks[currentIndex];
    const thumbnail = link.querySelector("img");

    largeImage.src = link.href; // the link points to the full-size picture
    largeImage.alt = thumbnail.alt;
    caption.textContent = thumbnail.alt + " (" + (currentIndex + 1) + " of " + galleryLinks.length + ")";
  }

  function openLightbox(index) {
    lastFocused = document.activeElement;
    showPicture(index);
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("no-scroll");
    if (lastFocused) {
      lastFocused.focus(); // put the keyboard focus back where it was
    }
  }


  // ---------- 3. Mouse and keyboard controls ----------

  // Clicking a thumbnail opens the lightbox instead of following the link
  galleryLinks.forEach(function (link, index) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      openLightbox(index);
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", function () { showPicture(currentIndex - 1); });
  nextButton.addEventListener("click", function () { showPicture(currentIndex + 1); });

  // Clicking the dark background (not the picture) also closes it
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard: Escape closes, arrow keys move between pictures
  document.addEventListener("keydown", function (event) {
    if (lightbox.hidden) {
      return;
    }
    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      showPicture(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      showPicture(currentIndex + 1);
    }
  });
}
