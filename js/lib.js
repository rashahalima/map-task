import { Person } from "./Person.js";
import { Result } from "./Result.js";

export const map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
const form = document.getElementById("main-form");

const fname = document.getElementById("fname");
const lname = document.getElementById("lname");

const male = document.getElementById("male");
const female = document.getElementById("female");

const age = document.getElementById("age");
const lat = document.getElementById("lat");
const lon = document.getElementById("lon");

const add = document.getElementById("add");

const draw = document.getElementById("draw");
const mapElement = document.getElementById("map");
mapElement.style.display = "none";
const persons = [];
const males = [];
const females = [];
const MIN_PERSONS = 6;
let result;
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let gender;

  if (male.checked) {
    gender = male.value;
  } else if (female.checked) {
    gender = female.value;
  }

  const person = new Person(
    fname.value,
    lname.value,
    gender,
    age.value,
    lon.value,
    lat.value,
  );

  persons.push(person);

  if (person.gender === "MALE") {
    males.push(person);
  } else {
    females.push(person);
  }

  console.log("Persons:", persons);
  console.log("Males:", males);
  console.log("Females:", females);

  form.reset();
  if (
    persons.length >= MIN_PERSONS &&
    males.length >= 3 &&
    females.length >= 3
  ) {
    draw.disabled = false;
  }

  // autoZoom(persons);
});

//}
//M1 _______________________________________________________________
export const autoZoom = (pPoints, map) => {
  // the points are empty or not ??
  if (!pPoints || pPoints.length === 0) return;
  //console.log("AUTO ZOOM:", pPoints);

  // [e.lon, e.lat] X

  // const points = pPoints.map((e) => [e.lat, e.lon]);
  const points = pPoints.map((e) => [parseFloat(e.lat), parseFloat(e.lon)]);
  console.log("POINTS:", points);

  // const points = [
  //   [51.505, -0.09],
  //   [35, 43],
  //   [55, 46],
  //   [60, 71],
  // ];

  // 1. covert all the points to leaflet latlng
  const leafletLatLngs = points.map((e) => L.latLng(e));

  // 2. made the haypthicl bounds
  const test = L.latLngBounds(leafletLatLngs);
  const center = test.getCenter();
  console.log("POINTS:", points);

  // the longest distance F the center
  const longest = points.reduce((acc, currentPoint) => {
    const currentDistance = center.distanceTo(L.latLng(currentPoint));
    return currentDistance > acc ? currentDistance : acc;
  }, 0);
  // console.log(longest);

  // 4. add the circcle

  const cerrcil = L.circle(center, {
    radius: longest,
    // color: "",
    color: false,
    fillOpacity: 0,
  }).addTo(map);

  // 5. tack the bounds of the circle
  const circleBounds = cerrcil.getBounds();

  // 6. mack it as the zoom level
  const sZoom = map.getBoundsZoom(circleBounds);
  // console.log(center);

  // 7. add the polygon

  // sorry Karam -_-
  // const maleP = pPoints.filter((e) => e.gender === "MALE").map((e) => [e.lat, e.lon]);
  // const femaleP = pPoints.filter((e) => e.gender === "FEMALE").map((e) => [e.lat, e.lon]);

  // // const malePolygon =
  // L.polygon(maleP, {
  //   color: "",
  //   fillColor: "#add8e6",
  //   fillOpacity: 0,
  // }).addTo(map);

  // // const femalePolygon =
  // L.polygon(femaleP, {
  //   color: "",
  //   fillColor: "#e80326",
  //   fillOpacity: 0,
  // }).addTo(map);

  // 8. view the map
  console.log(center, sZoom);
  map.setView(center, 0);
  setTimeout(() => {
    map.flyTo(center, sZoom, {
      animate: true,
      duration: 2,
      easeLinearity: 0.2
    });
  }, 150);
};
//_______________________________________________________________________________
// M3
// const popupMapClick = (person, map) => {
//   popup
//     .setLatLng(person.latlng)
//     .setContent("You clicked the map at " + person.latlng.toString())
//     .openOn(map);
// }
//_______________________________________________________________________________
//M4
export const dPop = (result, map) => {
  const center = map.getCenter();
  let farthestWinner = result.winners[0];

  for (const person of result.winners) {
    const currentDistance = center.distanceTo(L.latLng(person.lat, person.lon));

    const farthestDistance = center.distanceTo(
      L.latLng(farthestWinner.lat, farthestWinner.lon),
    );

    if (currentDistance > farthestDistance) {
      farthestWinner = person;
      console.log(farthestWinner);
    }
  }

  let youngestLoser = result.losers[0];

  for (const person of result.losers) {
    if (Number(person.age) < Number(youngestLoser.age)) {
      youngestLoser = person;
    }
  }

  L.marker([farthestWinner.lat, farthestWinner.lon])
    .bindPopup(
      `
      <b>Winner</b><br>
      Name: ${farthestWinner.fname} ${farthestWinner.lname}<br>
      Age: ${farthestWinner.age}<br>
      Gender: ${farthestWinner.gender}
    `,
    )
    .addTo(map)
    .openPopup();

  L.marker([youngestLoser.lat, youngestLoser.lon])
    .addTo(map)
    .bindPopup(
      `
      <b>Loser</b><br>
      Name: ${youngestLoser.fname} ${youngestLoser.lname}<br>
      Age: ${youngestLoser.age}<br>
      Gender: ${youngestLoser.gender}
    `,
    )
    ;
};
draw.addEventListener("click", (e) => {
  mapElement.style.display = "block";
  form.style.display = "none";
  const maleCoords = males.map((person) => {
    const latLng = [parseFloat(person.lat), parseFloat(person.lon)];
    L.marker(latLng)
      .bindPopup(
        `<b>${person.fname} ${person.lname}</b><br>Gender: Male<br>Age: ${person.age}`,
      )
      .addTo(map);

    return latLng;
  });

  const femaleCoords = females.map((person) => {
    const latLng = [parseFloat(person.lat), parseFloat(person.lon)];

    L.marker(latLng)
      .bindPopup(
        `<b>${person.fname} ${person.lname}</b><br>Gender: Female<br>Age: ${person.age}`,
      )
      .addTo(map);

    return latLng;
  });

  const malePolygon = L.polygon(maleCoords, {
    color: "#007bff",
    fillColor: "#007bff",
    fillOpacity: 0.4,
  }).addTo(map);

  const maleArea = calculatePolygonArea(maleCoords);
  malePolygon
    .bindPopup(`<b>Males Polygon/b><br>Size: ${maleArea.toFixed(2)} Km²`)
    .openPopup();

  const femalePolygon = L.polygon(femaleCoords, {
    color: "#ff4d94",
    fillColor: "#ff4d94",
    fillOpacity: 0.4,
  }).addTo(map);

  const femaleArea = calculatePolygonArea(femaleCoords);
  femalePolygon.bindPopup(
    `<b>Females Polygon/b><br>Size: ${femaleArea.toFixed(2)} Km²`,
  );
  setTimeout(() => {
    map.invalidateSize();
    autoZoom(persons, map);

  }, 200);
  femaleArea > maleArea
    ? (result = new Result(females, males))
    : (result = new Result(males, females));
  dPop(result, map);
  autoZoom(persons, map);

  // console.log(result.winners);
});

function calculatePolygonArea(coords) {
  let area = 0;
  const R = 6378.137;
  if (coords.length > 2) {
    for (let i = 0; i < coords.length; i++) {
      let p1 = coords[i];
      let p2 = coords[(i + 1) % coords.length];
      let lat1 = (p1[0] * Math.PI) / 180;
      let lat2 = (p2[0] * Math.PI) / 180;
      let lon1 = (p1[1] * Math.PI) / 180;
      let lon2 = (p2[1] * Math.PI) / 180;
      area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    area = (area * R * R) / 2;
  }
  return Math.abs(area);
}

const btnTest = document.getElementById("btn-test");

if (btnTest) {
  btnTest.addEventListener("click", () => {
    const testMales = [
      new Person("Ahmed", "Ali", "MALE", "25", "-0.09", "51.515"),
      new Person("Khaled", "Omar", "MALE", "30", "-0.06", "51.520"),
      new Person("Omar", "Hassan", "MALE", "28", "-0.05", "51.505"),
    ];
    const testFemales = [
      new Person("Sara", "Ahmed", "FEMALE", "22", "-0.09", "51.495"),
      new Person("Reem", "Zaid", "FEMALE", "27", "-0.1", "51.490"),
      new Person("Layla", "Murad", "FEMALE", "24", "-0.04", "51.500"),
    ];

    testMales.forEach((p) => {
      persons.push(p);
      males.push(p);
    });
    testFemales.forEach((p) => {
      persons.push(p);
      females.push(p);
    });

    console.log("Males:", males);
    console.log("Females:", females);

    draw.disabled = false;

    btnTest.textContent = "Done";
    btnTest.disabled = true;
  });
}

export const getResult = () => {
  return result;
};
