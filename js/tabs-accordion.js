/* =========================================================
   tabs-accordion.js - interactive elements on the Services page

   1. Tabs (plain JavaScript): Land Rover / Range Rover / Jaguar
   2. Accordion (jQuery): frequently asked questions
   ========================================================= */


// ---------- 1. Tabs ----------
// Only one vehicle panel is shown at a time. Clicking a tab button
// hides all the panels and then shows the one that belongs to the button.
const tabButtons = document.querySelectorAll('[role="tab"]');
const tabPanels = document.querySelectorAll('[role="tabpanel"]');

function showTab(chosenButton) {
  // Step 1: un-select every tab and hide every panel
  tabButtons.forEach(function (button) {
    button.setAttribute("aria-selected", "false");
  });
  tabPanels.forEach(function (panel) {
    panel.hidden = true;
  });

  // Step 2: select the chosen tab and show its panel
  // (aria-controls holds the id of the panel that belongs to the button)
  chosenButton.setAttribute("aria-selected", "true");
  const chosenPanel = document.getElementById(chosenButton.getAttribute("aria-controls"));
  chosenPanel.hidden = false;
}

tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    showTab(button);
  });
});

// Show the first tab when the page loads
if (tabButtons.length > 0) {
  showTab(tabButtons[0]);
}


// ---------- 2. Accordion (uses the jQuery library) ----------
// In jQuery, $(".something") selects elements, like document.querySelectorAll.
// jQuery is loaded from code.jquery.com, so we first check that it arrived.
if (window.jQuery) {
  const $questions = $(".accordion-button");
  const $answers = $(".accordion-panel");

  // Start with every answer closed
  $answers.hide();
  $questions.attr("aria-expanded", "false");

  $questions.on("click", function () {
    const $question = $(this);
    // The button sits inside an <h3>, and the answer comes right after the <h3>
    const $answer = $question.parent().next(".accordion-panel");
    const isOpen = $question.attr("aria-expanded") === "true";

    // Close any other answer that is open
    $questions.not($question).attr("aria-expanded", "false");
    $answers.not($answer).slideUp(300);

    // Open or close the answer that was clicked, with a sliding animation
    $question.attr("aria-expanded", String(!isOpen));
    $answer.slideToggle(300);
  });
}
