import { Person } from "./Person.js";
import { Result } from "./Result.js";

export const map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
});

draw.addEventListener("click", (e) => {
  mapElement.style.display = "block"; 
  form.style.display="none";
  const maleCoords = males.map(person => {
      const latLng = [parseFloat(person.lat), parseFloat(person.lon)];
            L.marker(latLng)
       .bindPopup(`<b>${person.fname} ${person.lname}</b><br>Gender: Male<br>Age: ${person.age}`)
       .addTo(map);

      return latLng;
  });

  const femaleCoords = females.map(person => {
      const latLng = [parseFloat(person.lat), parseFloat(person.lon)];
      
      L.marker(latLng)
       .bindPopup(`<b>${person.fname} ${person.lname}</b><br>Gender: Female<br>Age: ${person.age}`)
       .addTo(map);

      return latLng;
  });

      const malePolygon = L.polygon(maleCoords, {
          color: '#007bff',
          fillColor: '#007bff',
          fillOpacity: 0.4
      }).addTo(map);

      const maleArea = calculatePolygonArea(maleCoords);
      malePolygon.bindPopup(`<b>Males Polygon/b><br>Size: ${maleArea.toFixed(2)} Km²`).openPopup();

      const femalePolygon = L.polygon(femaleCoords, {
          color: '#ff4d94',  
          fillColor: '#ff4d94',
          fillOpacity: 0.4
      }).addTo(map);

      const femaleArea = calculatePolygonArea(femaleCoords);
      femalePolygon.bindPopup(`<b>Females Polygon/b><br>Size: ${femaleArea.toFixed(2)} Km²`);
      setTimeout(() => {
      map.invalidateSize();
  }, 100); 
  femaleArea>maleArea ? result=new Result(females,males) : result=new Result(males,females);
  // console.log(result.winners);
});

function calculatePolygonArea(coords) {
    let area = 0;
    const R = 6378.137;
    if (coords.length > 2) {
        for (let i = 0; i < coords.length; i++) {
            let p1 = coords[i];
            let p2 = coords[(i + 1) % coords.length];
            let lat1 = p1[0] * Math.PI / 180;
            let lat2 = p2[0] * Math.PI / 180;
            let lon1 = p1[1] * Math.PI / 180;
            let lon2 = p2[1] * Math.PI / 180;
            area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
        }
        area = area * R * R / 2;
    }
    return Math.abs(area);
}

const btnTest = document.getElementById("btn-test");

if (btnTest) {
  btnTest.addEventListener("click", () => {
    const testMales = [
      new Person("Ahmed", "Ali", "MALE", "25", "-0.09", "51.515"),
      new Person("Khaled", "Omar", "MALE", "30", "-0.06", "51.520"),
      new Person("Omar", "Hassan", "MALE", "28", "-0.05", "51.505")
    ];
    const testFemales = [
      new Person("Sara", "Ahmed", "FEMALE", "22", "-0.09", "51.495"),
      new Person("Reem", "Zaid", "FEMALE", "27", "-0.1", "51.490"),
      new Person("Layla", "Murad", "FEMALE", "24", "-0.04", "51.500")
    ];

    testMales.forEach(p => { persons.push(p); males.push(p); });
    testFemales.forEach(p => { persons.push(p); females.push(p); });

    console.log("Males:", males);
    console.log("Females:", females);

    draw.disabled = false;
    
    btnTest.textContent = "Done";
    btnTest.disabled = true;
  });
}

export const getResult=()=>{
  return result;
}