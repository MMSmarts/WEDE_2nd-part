/* =========================================================
   main.js - JavaScript that runs on EVERY page

   1. Tell the CSS that JavaScript is switched on
   2. Helper function used by the other JavaScript files
   3. Mobile navigation menu (open / close)
   4. Footer: current year and "share this page" links
   5. Scroll animations (sections fade in as you scroll)
   6. "Back to top" button
   ========================================================= */


// ---------- 1. Tell the CSS that JavaScript is switched on ----------
// Adds the class "js" to the <html> tag. The CSS uses this so that
// things like the mobile menu and tabs only change when JavaScript works.
document.documentElement.classList.add("js");


// ---------- 2. Helper function ----------
// Creates a new HTML element with some text and (optionally) a class.
// It uses textContent instead of innerHTML, so text typed by a visitor is
// always shown as plain text and can never run as code. This protects the
// site against cross-site scripting (XSS) attacks.
function makeElement(tagName, text, className) {
  const element = document.createElement(tagName);
  if (text) {
    element.textContent = text;
  }
  if (className) {
    element.className = className;
  }
  return element;
}


// ---------- 3. Mobile navigation menu ----------
const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

if (menuButton && mainNav) {
  menuButton.addEventListener("click", function () {
    // aria-expanded tells screen readers whether the menu is open
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mainNav.classList.toggle("open");
  });
}


// ---------- 4. Footer: current year and share links ----------
// Shows the current year, so the copyright notice never goes out of date.
const yearSpan = document.querySelector("#year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Builds the "Share this page" links in the footer (social media promotion).
// The live address of the page is taken from the <link rel="canonical"> tag.
const canonicalLink = document.querySelector('link[rel="canonical"]');
const shareLinks = document.querySelectorAll("[data-share]");

if (canonicalLink) {
  const pageUrl = encodeURIComponent(canonicalLink.href);
  const pageTitle = encodeURIComponent(document.title);

  const shareAddresses = {
    facebook: "https://www.facebook.com/sharer/sharer.php?u=" + pageUrl,
    whatsapp: "https://wa.me/?text=" + pageTitle + "%20" + pageUrl,
    x: "https://twitter.com/intent/tweet?url=" + pageUrl + "&text=" + pageTitle,
    linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=" + pageUrl
  };

  shareLinks.forEach(function (link) {
    link.href = shareAddresses[link.dataset.share];
  });
}


// ---------- 5. Scroll animations ----------
// Every section after the first one gets the class "reveal" (hidden and
// moved down slightly by the CSS). The Intersection Observer watches the
// sections and adds the class "visible" when one scrolls onto the screen,
// which makes it fade and slide into place.
const revealSections = document.querySelectorAll("main > section:not(:first-child)");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // only animate once
      }
    });
  }, { threshold: 0.1 });

  revealSections.forEach(function (section) {
    section.classList.add("reveal");
    observer.observe(section);
  });
}


// ---------- 6. "Back to top" button ----------
// The button is created with JavaScript and added to the page.
const backToTopButton = makeElement("button", "↑ Top", "back-to-top");
backToTopButton.type = "button";
backToTopButton.setAttribute("aria-label", "Back to top of page");
document.body.appendChild(backToTopButton);

// Only show the button after scrolling down 500 pixels
window.addEventListener("scroll", function () {
  backToTopButton.classList.toggle("show", window.scrollY > 500);
});

backToTopButton.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
