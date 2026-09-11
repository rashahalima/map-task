// import { outoZoom } from "./lib.js";
import { outoZoom, persons, draw } from "./lib.js";
///////////////////////////////

///////////////////////////////////////////

function method4(winners, losers, map) {
  const center = map.getCenter();
  let farthestWinner = winners[0];

  for (const person of winners) {
    const currentDistance = center.distanceTo(
      L.latLng(person.lat, person.lon)
    );

    const farthestDistance = center.distanceTo(
      L.latLng(farthestWinner.lat, farthestWinner.lon)
    );

    if (currentDistance > farthestDistance) {
      farthestWinner = person;
    }
  }

  let youngestLoser = losers[0];

  for (const person of losers) {
    if (Number(person.age) < Number(youngestLoser.age)) {
      youngestLoser = person;
    }
  }

  L.marker([farthestWinner.lat, farthestWinner.lon])
    .addTo(map)
    .bindPopup(`
      <b>Winner</b><br>
      Name: ${farthestWinner.fname} ${farthestWinner.lname}<br>
      Age: ${farthestWinner.age}<br>
      Gender: ${farthestWinner.gender}
    `)
    .openPopup();

  L.marker([youngestLoser.lat, youngestLoser.lon])
    .addTo(map)
    .bindPopup(`
      <b>Loser</b><br>
      Name: ${youngestLoser.fname} ${youngestLoser.lname}<br>
      Age: ${youngestLoser.age}<br>
      Gender: ${youngestLoser.gender}
    `);
}
///////////////////////////////////////
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

  /////هون الاستدعاء
  // const result = method2();

  // method4(result.winners, result.losers, map);

  ////

  // ======
  outoZoom(persons, map);
  // ======
});
// const persons = tackTheData();
// outoZoom(persons, map);
// tackTheData();
