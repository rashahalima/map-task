import { Person } from "./Person.js";
//export const tackTheData = () => {
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

    // outoZoom(persons);
    
  });

//}
//M1 _______________________________________________________________
export const outoZoom = (pPoints, map) => {
  // the points are empty or not ??
  if (!pPoints || pPoints.length === 0) return;


  // [e.lon, e.lat] X
  const points = pPoints.map((e) => [e.lat, e.lon]);
  
  
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
  //   color: "blue",
  //   fillColor: "#add8e6",
  //   fillOpacity: 0.5,
  // }).addTo(map);

  // // const femalePolygon =
  // L.polygon(femaleP, {
  //   color: "pink",
  //   fillColor: "#e80326",
  //   fillOpacity: 0.5,
  // }).addTo(map);



  // 8. view the map 
  map.setView(center, sZoom);
}
//_______________________________________________________________________________
