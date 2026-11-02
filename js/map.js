/* =========================================================
   map.js - interactive map on the Contact page

   Uses the Leaflet library (loaded from unpkg.com) with map pictures
   ("tiles") from OpenStreetMap.

   1. Show the map with a marker on our workshop
   2. "How far am I?" button - a location-based feature that uses the
      visitor's location (only if they allow it) to work out the distance
   ========================================================= */

const mapBox = document.querySelector("#map");

if (mapBox && window.L) {

  // ---------- 1. The map ----------
  const workshopLocation = [-26.0260, 27.9486]; // latitude and longitude of Ohm Street, Kya Sands

  // Create the map and zoom in on the workshop (zoom level 15 shows the streets).
  // scrollWheelZoom is switched off so the page still scrolls normally over the map.
  const map = L.map("map", { scrollWheelZoom: false }).setView(workshopLocation, 15);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Marker with a pop-up showing our address
  L.marker(workshopLocation)
    .addTo(map)
    .bindPopup("<strong>INNO-MAC JHB</strong><br>No 4 Ohm Street, Unit 5<br>Kya Sands, Randburg")
    .openPopup();


  // ---------- 2. "How far am I?" ----------
  const distanceButton = document.querySelector("#distance-button");
  const distanceText = document.querySelector("#distance-text");

  distanceButton.hidden = false; // the button only works with JavaScript, so it starts hidden

  distanceButton.addEventListener("click", function () {
    if (!navigator.geolocation) {
      distanceText.textContent = "Sorry, your browser cannot share your location.";
      return;
    }

    distanceText.textContent = "Finding your location...";

    // The browser asks the visitor for permission before sharing their location
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // Success: mark the visitor on the map and show both places
        const visitorLocation = [position.coords.latitude, position.coords.longitude];

        L.circleMarker(visitorLocation, { radius: 8, color: "#1f4e79" })
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();

        map.fitBounds([workshopLocation, visitorLocation], { padding: [40, 40] });

        // map.distance() gives the distance in metres; divide by 1000 for kilometres
        const kilometres = map.distance(workshopLocation, visitorLocation) / 1000;
        distanceText.textContent = "You are about " + kilometres.toFixed(1) +
          " km from our workshop (in a straight line).";
      },
      function () {
        // Error: e.g. the visitor said no, or the location could not be found
        distanceText.textContent = "We could not find your location. Please allow location access, " +
          "or use the directions link below.";
      }
    );
  });

} else if (mapBox) {
  // Leaflet did not load (for example, there is no internet connection)
  mapBox.textContent = "The map could not be loaded. Our address is No 4 Ohm Street, Unit 5, " +
    "Ohm Business Park, Kya Sands, Randburg, 2194.";
}
