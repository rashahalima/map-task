import { Person } from "./Person.js";

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
});
