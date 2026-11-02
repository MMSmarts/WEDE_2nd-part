/* =========================================================
   services.js - the list of services and the code that shows them

   The services are stored in ONE place (the array below) and used on:
   - the Home page:     shows the "popular" services
   - the Services page: shows every service, with search, filter and sort
   - the Enquiry page:  forms.js looks up prices here to work out an estimate

   1. Service data
   2. Helper functions
   3. Home page - popular services
   4. Services page - search, filter and sort
   ========================================================= */


// ---------- 1. Service data ----------
// Each service is an object. Prices are estimates in Rand (including VAT).
const services = [
  {
    id: "minor-service",
    name: "Minor Service",
    category: "maintenance",
    price: 2500,
    duration: "Half a day",
    description: "Oil and filter change, fluid top-ups and a 30-point safety check for your Land Rover or Jaguar.",
    image: "assets/images/thumbs/workshop-parts-tools.jpg",
    imageAlt: "Car parts and tools ready for a minor service",
    popular: true
  },
  {
    id: "major-service",
    name: "Major Service",
    category: "maintenance",
    price: 5800,
    duration: "1 day",
    description: "Everything in a minor service plus spark plugs, air and fuel filters, brake fluid and a full inspection.",
    image: "assets/images/thumbs/about-workshop-mechanic.jpg",
    imageAlt: "Technician working on a car during a major service",
    popular: false
  },
  {
    id: "tune-up",
    name: "Engine Tune-up",
    category: "maintenance",
    price: 1800,
    duration: "Half a day",
    description: "Engine check, idle and timing settings and a road test to get your engine running smoothly again.",
    image: "assets/images/thumbs/service-land-rover-discovery.jpg",
    imageAlt: "Land Rover Discovery ready for an engine tune-up",
    popular: false
  },
  {
    id: "tyres",
    name: "Tyre Rotation and Wheel Alignment",
    category: "maintenance",
    price: 650,
    duration: "1 to 2 hours",
    description: "Tyres are rotated and the wheels are aligned so your tyres wear evenly and the car drives straight.",
    image: "assets/images/thumbs/hero-land-rover-defender.jpg",
    imageAlt: "Land Rover Defender parked outside the workshop",
    popular: false
  },
  {
    id: "brakes",
    name: "Brake Pads and Discs",
    category: "repairs",
    price: 3200,
    duration: "Half a day",
    description: "Replacement of worn brake pads and discs with quality parts, followed by a brake test.",
    image: "assets/images/thumbs/service-range-rover.jpg",
    imageAlt: "Range Rover in for brake repairs",
    popular: false
  },
  {
    id: "air-suspension",
    name: "Air Suspension Repair",
    category: "repairs",
    price: 6500,
    duration: "1 to 2 days",
    description: "We find and fix air suspension faults such as leaking air springs, a faulty compressor or a sagging vehicle.",
    image: "assets/images/thumbs/service-range-rover.jpg",
    imageAlt: "Range Rover with air suspension",
    popular: true
  },
  {
    id: "gearbox",
    name: "Gearbox and Transmission Service",
    category: "repairs",
    price: 4500,
    duration: "1 day",
    description: "Gearbox oil and filter change and a check of the transmission for smooth gear changes.",
    image: "assets/images/thumbs/service-jaguar-f-type.jpg",
    imageAlt: "Jaguar F-Type in for a gearbox service",
    popular: false
  },
  {
    id: "diagnostics",
    name: "Computer Diagnostics",
    category: "diagnostics",
    price: 950,
    duration: "1 to 2 hours",
    description: "A full fault-code scan with Land Rover and Jaguar diagnostic software to find out why a warning light is on.",
    image: "assets/images/thumbs/diagnostics-obd-scanner.jpg",
    imageAlt: "OBD2 diagnostic scanner reading vehicle data",
    popular: true
  },
  {
    id: "mobile-unit",
    name: "Mobile Unit Call-out",
    category: "extras",
    price: 750,
    duration: "Same day",
    description: "Our fully equipped mobile unit comes to your home or office when your vehicle cannot be driven.",
    image: "assets/images/thumbs/workshop-parts-tools.jpg",
    imageAlt: "Tools carried by the mobile unit",
    popular: false
  },
  {
    id: "valet",
    name: "Valet Package",
    category: "extras",
    price: 450,
    duration: "2 hours",
    description: "Exterior wash, interior valet, wheel cleaning and tyre dressing so your car comes back looking new.",
    image: "assets/images/thumbs/service-jaguar-f-type.jpg",
    imageAlt: "Clean Jaguar F-Type after a valet",
    popular: false
  }
];

// Readable names for each category
const categoryNames = {
  maintenance: "Maintenance",
  repairs: "Repairs",
  diagnostics: "Diagnostics",
  extras: "Extras"
};


// ---------- 2. Helper functions ----------

// Formats a number as South African Rand, for example 2500 becomes "R2 500"
function formatRand(amount) {
  return "R" + amount.toLocaleString("en-ZA");
}

// Builds one service card (an <article>) from a service object.
// makeElement() is defined in main.js.
function createServiceCard(service) {
  const card = makeElement("article", "", "card");

  const image = document.createElement("img");
  image.src = service.image;
  image.alt = service.imageAlt;
  image.width = 600;
  image.height = 400;
  image.loading = "lazy"; // only download the picture when it is near the screen

  const badge = makeElement("span", categoryNames[service.category], "badge");
  const title = makeElement("h3", service.name);
  const description = makeElement("p", service.description);
  const price = makeElement("p", "From " + formatRand(service.price) + " · " + service.duration, "price");

  // Link to the enquiry form with this service already selected
  const link = makeElement("a", "Enquire now", "btn");
  link.href = "enquiry.html?service=" + service.id;
  link.setAttribute("aria-label", "Enquire about " + service.name);

  card.append(image, badge, title, description, price, link);
  return card;
}


// ---------- 3. Home page - popular services ----------
const popularList = document.querySelector("#popular-list");

if (popularList) {
  const popularServices = services.filter(function (service) {
    return service.popular;
  });

  popularServices.forEach(function (service) {
    popularList.appendChild(createServiceCard(service));
  });
}


// ---------- 4. Services page - search, filter and sort ----------
const serviceList = document.querySelector("#service-list");

if (serviceList) {
  const searchInput = document.querySelector("#service-search");
  const categorySelect = document.querySelector("#service-category");
  const sortSelect = document.querySelector("#service-sort");
  const resultsCount = document.querySelector("#results-count");
  const noResults = document.querySelector("#no-results");
  const clearButton = document.querySelector("#clear-filters");

  // Works out which services to show, puts them in order and displays them
  function showServices() {
    const searchText = searchInput.value.trim().toLowerCase();
    const chosenCategory = categorySelect.value;

    // Step 1: FILTER - keep only services that match the search and category
    const results = services.filter(function (service) {
      const matchesCategory = chosenCategory === "all" || service.category === chosenCategory;
      const matchesSearch =
        service.name.toLowerCase().includes(searchText) ||
        service.description.toLowerCase().includes(searchText);
      return matchesCategory && matchesSearch;
    });

    // Step 2: SORT - put the results in the order the visitor chose
    if (sortSelect.value === "price-low") {
      results.sort(function (a, b) { return a.price - b.price; });
    } else if (sortSelect.value === "price-high") {
      results.sort(function (a, b) { return b.price - a.price; });
    } else {
      results.sort(function (a, b) { return a.name.localeCompare(b.name); });
    }

    // Step 3: SHOW - remove the old cards and add the new ones
    serviceList.replaceChildren();
    results.forEach(function (service) {
      serviceList.appendChild(createServiceCard(service));
    });

    resultsCount.textContent = "Showing " + results.length + " of " + services.length + " services";
    noResults.hidden = results.length > 0;
  }

  // Update the list every time the visitor types or changes a drop-down
  searchInput.addEventListener("input", showServices);
  categorySelect.addEventListener("change", showServices);
  sortSelect.addEventListener("change", showServices);

  clearButton.addEventListener("click", function () {
    searchInput.value = "";
    categorySelect.value = "all";
    sortSelect.value = "name";
    showServices();
    searchInput.focus();
  });

  showServices(); // show all services when the page first loads
}
