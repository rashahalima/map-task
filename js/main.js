// import { outoZoom, tackTheData } from "./lib.js";

const form = document.getElementById("main-form");

var map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var marker = L.marker([51.5, -0.09]).addTo(map);

var polygon = L.polygon([
  [51.509, -0.08],
  [51.503, -0.06],
  [51.51, -0.047],
]).addTo(map);

marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
polygon.bindPopup("I am a polygon.");

draw.addEventListener("click", () => {
  form.style.display = "none";
  document.getElementById("map").style.display = "block";

  map.invalidateSize();
});
// const persons = tackTheData();
// outoZoom(persons);
// tackTheData();