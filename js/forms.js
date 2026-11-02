/* =========================================================
   forms.js - checking (validating) and processing the two forms

   PART A: Shared checking functions (used by both forms)
   PART B: Enquiry form (enquiry.html)
           - works out an estimated cost and checks availability
           - sends the enquiry with AJAX (fetch) without reloading the page
   PART C: Contact form (contact.html)
           - compiles the message into an email that the visitor can send

   How the validation works:
   - The HTML already has rules such as "required", "maxlength",
     "type=email" and "pattern" (HTML5 validation).
   - JavaScript switches off the browser's own pop-up messages
     (form.noValidate = true) and checks every field itself. That way it
     can show a clear message under each field and check things HTML
     cannot, such as dates in the past.
   - Validation in the browser makes the form easier to use, but a real
     server must check the data again, because browser checks can be
     switched off by a determined attacker.

   Uses makeElement() from main.js and services / formatRand() from services.js.
   ========================================================= */


// Email address that contact form messages are sent to
const RECIPIENT_EMAIL = "info@innomac-jhb.co.za";

const COURTESY_CAR_PRICE = 350; // Rand per day
const MAX_DAYS_AHEAD = 90;      // bookings can be made up to 3 months ahead


/* =========================================================
   PART A: Shared checking functions
   Each "check" function gets the value the visitor typed and returns:
   - an error message (text) if something is wrong, or
   - an empty string "" if the value is fine.
   ========================================================= */

function checkName(value) {
  if (value === "") {
    return "Please enter your full name.";
  }
  if (value.length < 2) {
    return "Your name must be at least 2 characters long.";
  }
  // Only letters (including letters like é), spaces, hyphens and apostrophes
  if (!/^[A-Za-zÀ-ÿ' -]+$/.test(value)) {
    return "Your name can only contain letters, spaces, hyphens and apostrophes.";
  }
  return "";
}

function checkEmail(value) {
  if (value === "") {
    return "Please enter your email address.";
  }
  // Must look like: something@something.something
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
    return "Please enter a valid email address, for example name@example.com.";
  }
  return "";
}

function checkPhone(value, isRequired) {
  const digits = value.replace(/[\s-]/g, ""); // remove spaces and dashes first
  if (digits === "") {
    return isRequired ? "Please enter your phone number." : "";
  }
  // South African number: 0 followed by 9 digits, or +27 followed by 9 digits
  if (!/^(\+27|0)[0-9]{9}$/.test(digits)) {
    return "Please enter a valid South African phone number, for example 082 123 4567 or +27 82 123 4567.";
  }
  return "";
}

function checkLength(value, min, max, fieldName, isRequired) {
  if (value === "") {
    return isRequired ? "Please fill in the " + fieldName + "." : "";
  }
  if (value.length < min) {
    return "The " + fieldName + " must be at least " + min + " characters long (you have typed " + value.length + ").";
  }
  if (value.length > max) {
    return "The " + fieldName + " can be at most " + max + " characters long.";
  }
  return "";
}

function checkYear(value) {
  const latestYear = new Date().getFullYear() + 1; // next year's models are already on sale
  if (value === "") {
    return "Please enter the year your vehicle was made.";
  }
  const year = Number(value);
  if (!Number.isInteger(year) || year < 1990 || year > latestYear) {
    return "Please enter a year between 1990 and " + latestYear + ".";
  }
  return "";
}

function checkDate(value) {
  if (value === "") {
    return "Please choose your preferred date.";
  }
  const chosenDate = new Date(value + "T00:00:00");
  const today = getToday();
  const lastDate = new Date(today);
  lastDate.setDate(today.getDate() + MAX_DAYS_AHEAD);

  if (chosenDate < today) {
    return "The date cannot be in the past.";
  }
  if (chosenDate > lastDate) {
    return "Please choose a date within the next 3 months.";
  }
  return "";
}

// Today's date at midnight (so only the day is compared, not the time)
function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// Turns a date into the "YYYY-MM-DD" text that a date input uses
function toInputDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return date.getFullYear() + "-" + month + "-" + day;
}

// Shows an error message under a field, or removes it if the message is ""
function showError(field, message) {
  const errorBox = document.getElementById(field.id + "-error");
  errorBox.textContent = message;

  if (message === "") {
    field.classList.remove("invalid");
    field.removeAttribute("aria-invalid");
    field.classList.toggle("valid", field.value !== "");
  } else {
    field.classList.add("invalid");
    field.classList.remove("valid");
    field.setAttribute("aria-invalid", "true"); // tells screen readers the field has a problem
  }
}

// Checks every field in a form. "checks" links each field id to its check.
// Returns true if everything is correct, otherwise false.
function validateForm(checks) {
  let firstProblemField = null;

  for (const fieldId in checks) {
    const field = document.getElementById(fieldId);
    const message = checks[fieldId](field);
    showError(field, message);

    if (message !== "" && firstProblemField === null) {
      firstProblemField = field;
    }
  }

  if (firstProblemField !== null) {
    firstProblemField.focus(); // take the visitor straight to the first problem
    return false;
  }
  return true;
}

// Checks a field as soon as the visitor leaves it, and removes the error
// message while they are typing a correction.
function addLiveValidation(checks) {
  for (const fieldId in checks) {
    const field = document.getElementById(fieldId);

    field.addEventListener("change", function () {
      showError(field, checks[fieldId](field));
    });

    field.addEventListener("input", function () {
      if (field.classList.contains("invalid")) {
        showError(field, checks[fieldId](field));
      }
    });
  }
}

// Shows "25 / 500 characters" under a text area while the visitor types
function addCharacterCounter(textArea) {
  const counter = document.getElementById(textArea.id + "-count");

  function updateCounter() {
    counter.textContent = textArea.value.length + " / " + textArea.maxLength + " characters";
  }

  textArea.addEventListener("input", updateCounter);
  updateCounter();
}

// Spam protection: the "honeypot" field is hidden from people, so if it
// has been filled in, the form was almost certainly filled in by a robot.
function isSpam(form) {
  return form.querySelector(".honeypot input").value !== "";
}


/* =========================================================
   PART B: Enquiry form (enquiry.html)
   ========================================================= */

// Finds a service in the list from services.js by its id
function findService(id) {
  return services.find(function (service) {
    return service.id === id;
  });
}

// Works out the estimated cost of the enquiry
function calculateEstimate(enquiry) {
  const chosenService = findService(enquiry.serviceId);
  const lines = []; // each line has a label and an amount in Rand

  if (chosenService) {
    lines.push({ label: chosenService.name, amount: chosenService.price });
  } else {
    // "Other / not sure": we start by finding the problem with a diagnostics check
    lines.push({ label: "First inspection (computer diagnostics)", amount: findService("diagnostics").price });
  }

  if (enquiry.valet && enquiry.serviceId !== "valet") {
    lines.push({ label: "Valet package (extra)", amount: findService("valet").price });
  }

  if (enquiry.courtesyCar) {
    lines.push({ label: "Courtesy car (per day)", amount: COURTESY_CAR_PRICE });
  }

  let total = 0;
  lines.forEach(function (line) {
    total = total + line.amount;
  });

  return { service: chosenService, lines: lines, total: total };
}

// Decides how likely the preferred date is to be available
function checkAvailability(dateText) {
  const chosenDate = new Date(dateText + "T00:00:00");
  const daysAway = Math.round((chosenDate - getToday()) / (1000 * 60 * 60 * 24));
  const dayOfWeek = chosenDate.getDay(); // 0 = Sunday, 6 = Saturday

  if (daysAway <= 1) {
    return {
      limited: true,
      message: "This is short notice. We will phone you to confirm whether we can fit your vehicle in."
    };
  }
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      limited: true,
      message: "Weekend bookings are limited. We will phone you to confirm a time slot."
    };
  }
  return {
    limited: false,
    message: "Good news! We usually have space on weekdays, so this date is likely to be available."
  };
}

// Sends the enquiry to the address in the form's "action" attribute using
// AJAX (the Fetch API). The page does not reload while this happens.
// Returns true if the server received it, or false if something went wrong.
async function sendEnquiry(form, enquiry) {
  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enquiry)
    });

    if (!response.ok) {
      throw new Error("The server replied with status " + response.status);
    }

    const reply = await response.json();
    console.log("Enquiry received by the server:", reply);
    return true;
  } catch (error) {
    console.error("The enquiry could not be sent:", error);
    return false;
  }
}

// Builds the response panel that the visitor sees after submitting
function showEnquiryResult(panel, enquiry, estimate, availability, wasSent) {
  const firstName = enquiry.name.split(" ")[0];
  const reference = "INM-" + String(Date.now()).slice(-6);
  const niceDate = new Date(enquiry.date + "T00:00:00").toLocaleDateString("en-ZA", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  const heading = makeElement("h2", "Thank you, " + firstName + "!");

  let statusText;
  if (wasSent) {
    statusText = "Your enquiry has been sent. Your reference number is " + reference +
      ". We will email you at " + enquiry.email + " within one working day.";
  } else {
    statusText = "We could not send your enquiry right now (please check your internet connection). " +
      "Here is your estimate - please call us on (087) 702 9713 to book.";
  }
  const status = makeElement("p", statusText);
  panel.classList.toggle("warning", !wasSent); // gold border instead of green

  // Table with the estimated cost
  const costHeading = makeElement("h3", "Estimated cost for your " + enquiry.vehicle);
  const table = makeElement("table", "", "estimate-table");
  estimate.lines.forEach(function (line) {
    const row = table.insertRow();
    row.insertCell().textContent = line.label;
    row.insertCell().textContent = formatRand(line.amount);
  });
  const totalRow = table.insertRow();
  totalRow.className = "total-row";
  totalRow.insertCell().textContent = "Estimated total";
  totalRow.insertCell().textContent = formatRand(estimate.total);

  let timeText;
  if (estimate.service) {
    timeText = "Usual time needed: " + estimate.service.duration.toLowerCase() + ".";
  } else {
    timeText = "After the inspection we will give you a full quote for the repair.";
  }
  const time = makeElement("p", timeText);

  // Availability for the chosen date
  const availabilityHeading = makeElement("h3", "Availability on " + niceDate);
  const availabilityText = makeElement("p", availability.message, availability.limited ? "availability limited" : "availability");

  panel.replaceChildren(heading, status, costHeading, table, time, availabilityHeading, availabilityText);

  // Extra note for older vehicles
  const vehicleAge = new Date().getFullYear() - enquiry.year;
  if (vehicleAge > 15) {
    panel.appendChild(makeElement("p", "As your vehicle is more than 15 years old, it may need extra parts, so the final price could be higher.", "note"));
  }

  panel.appendChild(makeElement("p", "All prices are estimates and include VAT. Your final quote is confirmed after we inspect your vehicle.", "note"));

  panel.hidden = false;
  panel.focus(); // moves the screen (and screen readers) to the response
}

const enquiryForm = document.getElementById("enquiry-form");

if (enquiryForm) {
  enquiryForm.noValidate = true; // use our own messages instead of the browser's pop-ups

  const dateInput = document.getElementById("date");
  const yearInput = document.getElementById("year");
  const vehicleSelect = document.getElementById("vehicle");
  const serviceSelect = document.getElementById("service");
  const submitButton = enquiryForm.querySelector('button[type="submit"]');
  const resultPanel = document.getElementById("enquiry-result");

  // The date picker only allows dates from today up to 3 months ahead
  const today = getToday();
  const lastDate = new Date(today);
  lastDate.setDate(today.getDate() + MAX_DAYS_AHEAD);
  dateInput.min = toInputDate(today);
  dateInput.max = toInputDate(lastDate);
  yearInput.max = today.getFullYear() + 1;

  // Visitors who click "Enquire now" on the Services page arrive with
  // ?service=... at the end of the address, so we choose that service for them.
  const serviceFromLink = new URLSearchParams(window.location.search).get("service");
  if (findService(serviceFromLink)) {
    serviceSelect.value = serviceFromLink;
  }

  // Which check to run for each field (the key is the field's id).
  // (field) => ... is a short way of writing a function.
  const enquiryChecks = {
    "full-name": (field) => checkName(field.value.trim()),
    "email": (field) => checkEmail(field.value.trim()),
    "phone": (field) => checkPhone(field.value.trim(), true),
    "vehicle": (field) => (field.value === "" ? "Please choose your vehicle model." : ""),
    "year": (field) => checkYear(field.value.trim()),
    "service": (field) => (field.value === "" ? "Please choose the service you need." : ""),
    "date": (field) => checkDate(field.value),
    "message": (field) => checkLength(field.value.trim(), 0, 500, "message", false),
    "consent": (field) => (field.checked ? "" : "Please tick this box so that we may contact you about your enquiry.")
  };

  addLiveValidation(enquiryChecks);
  addCharacterCounter(document.getElementById("message"));

  enquiryForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // stop the browser from leaving the page

    if (isSpam(enquiryForm)) {
      return;
    }
    if (!validateForm(enquiryChecks)) {
      return; // stop here - the error messages are now showing
    }

    // 1. Collect the details the visitor entered
    const enquiry = {
      name: document.getElementById("full-name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      vehicle: vehicleSelect.options[vehicleSelect.selectedIndex].text,
      year: Number(yearInput.value),
      serviceId: serviceSelect.value,
      date: dateInput.value,
      valet: document.getElementById("valet").checked,
      courtesyCar: document.getElementById("courtesy-car").checked,
      message: document.getElementById("message").value.trim()
    };

    // 2. Work out the estimated cost and the availability
    const estimate = calculateEstimate(enquiry);
    const availability = checkAvailability(enquiry.date);

    // 3. Send the enquiry with AJAX (the button shows "Sending..." meanwhile)
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    const wasSent = await sendEnquiry(enquiryForm, enquiry);
    submitButton.disabled = false;
    submitButton.textContent = "Get my estimate";

    // 4. Show the response
    showEnquiryResult(resultPanel, enquiry, estimate, availability, wasSent);
  });
}


/* =========================================================
   PART C: Contact form (contact.html)
   ========================================================= */

// Shows the finished email and a button that opens the visitor's email app
function showEmailPreview(panel, subject, body, mailtoLink) {
  const heading = makeElement("h2", "Your email is ready to send");
  const intro = makeElement("p", "Please check your message below. When you click \"Send email\", your email app will open with everything filled in - just press Send.");

  const details = makeElement("dl", "", "email-preview");
  details.append(
    makeElement("dt", "To"), makeElement("dd", RECIPIENT_EMAIL),
    makeElement("dt", "Subject"), makeElement("dd", subject)
  );

  const bodyBox = makeElement("pre", body, "email-body");

  const sendLink = makeElement("a", "Send email", "btn");
  sendLink.href = mailtoLink;

  const tip = makeElement("p", "No email app on this device? Copy the message above and send it to " +
    RECIPIENT_EMAIL + ", or call us on (087) 702 9713.", "note");

  panel.replaceChildren(heading, intro, details, bodyBox, sendLink, tip);
  panel.hidden = false;
  panel.focus();
}

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.noValidate = true; // use our own messages instead of the browser's pop-ups

  const messageTypeSelect = document.getElementById("message-type");
  const previewPanel = document.getElementById("contact-result");

  const contactChecks = {
    "full-name": (field) => checkName(field.value.trim()),
    "email": (field) => checkEmail(field.value.trim()),
    "phone": (field) => checkPhone(field.value.trim(), false),
    "message-type": (field) => (field.value === "" ? "Please choose the type of message." : ""),
    "subject": (field) => checkLength(field.value.trim(), 5, 80, "subject", true),
    "message": (field) => checkLength(field.value.trim(), 20, 1000, "message", true)
  };

  addLiveValidation(contactChecks);
  addCharacterCounter(document.getElementById("message"));

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault(); // we build the email ourselves instead

    if (isSpam(contactForm)) {
      return;
    }
    if (!validateForm(contactChecks)) {
      return;
    }

    // 1. Collect what the visitor typed
    const name = document.getElementById("full-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const messageType = messageTypeSelect.options[messageTypeSelect.selectedIndex].text;
    const subjectText = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // 2. Compile the information into an email
    const subject = "[" + messageType + "] " + subjectText;
    const body =
      "Name: " + name + "\n" +
      "Email: " + email + "\n" +
      "Phone: " + (phone || "Not given") + "\n" +
      "Type of message: " + messageType + "\n\n" +
      message + "\n\n" +
      "Sent from the INNO-MAC JHB website contact form";

    // 3. Turn it into a "mailto:" link. encodeURIComponent() changes spaces,
    //    line breaks and symbols into a format that is safe inside a link.
    const mailtoLink = "mailto:" + RECIPIENT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    // 4. Show the preview with the "Send email" button
    showEmailPreview(previewPanel, subject, body, mailtoLink);
  });
}
