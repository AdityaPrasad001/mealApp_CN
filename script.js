"use strict";
const menu = document.querySelector("#menu-bars");
const navbar = document.querySelector(".navbar");
const search = document.getElementById("search");
const favourites = document.getElementById("favourite");

let favArray = [];
let favList = JSON.parse(localStorage.getItem("favArray"));

menu.onclick = () => {
  menu.classList.toggle("fa-times");
  navbar.classList.toggle("active");
};

// Swipper core code
var swiper = new Swiper(".home-slider", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 7500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  loop: true,
});

// Search implementation
const searchHandler = async (value) => {
  const result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`
  );
  const data = await result.json();
  if (!data.meals) return;

  const loadedMeals = data.meals;
  console.log(loadedMeals);
  addSearchResults(loadedMeals);
};

//setup before functions
let typingTimer;
let doneTypingInterval = 500;
search.addEventListener("keyup", function (e) {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    searchHandler(e.target.value);
  }, doneTypingInterval);
});

//on keydown, clear the countdown
search.addEventListener("keydown", function () {
  clearTimeout(typingTimer);
});

// search suggestions dynamically
function addSearchResults(meals) {
  const suggetion = document.querySelector(".search-suggestions");

  suggetion.innerHTML =
    meals &&
    meals.map((meal) => {
      return `
      <li class="loaded-meal" >  
        <div class="loaded_meal_name" 
          onclick="currMeal(${meal.idMeal})"
        >${meal.strMeal}</div>
        <button onclick="favHandler( ${meal.idMeal}, '${meal.strMeal}' )">
          <i class="fa-solid fa-heart"></i>
        </button>
      </li>`;
    });
}

// favourites list dynamically
function favResults() {
  const fav_lists = document.querySelector(".fav_lists");

  let html;

  if (favList && favList.length === 0) {
    html = `<p class="fav_meal_name">No favourite meal..</p>`;
  } else {
    // Remove duplicates
    const jsonObject = favList.map(JSON.stringify);
    let uniqueMealsSet = new Set(jsonObject);
    let uniqueMealsArray = Array.from(uniqueMealsSet).map(JSON.parse);
    // duplicate logic ends

    html = uniqueMealsArray.map(
      (favMeal) =>
        `<li class="loaded-meal" >
        <p class="fav_meal_name">${favMeal.meal}</p>
        <button  class="fav_meal_button" onclick="deleteHandler(${favMeal.id})">Remove</button>
    </li>`
    );
  }
  fav_lists.innerHTML = html;
}
favourites.addEventListener("click", favResults);

function deleteHandler(id) {
  favList = favList.filter((favMeal) => favMeal.id !== id);
  localStorage.setItem("favArray", JSON.stringify(favList));
  favResults();
}

function currMeal(meal) {
  console.log(meal);
  localStorage.setItem("currentMeal", meal);
  window.location = "./meals.html";
}

function favHandler(id, meal) {
  favArray.push({ id: id, meal: meal });
  localStorage.setItem("favArray", JSON.stringify(favArray));
}
