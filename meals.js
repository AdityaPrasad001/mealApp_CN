const searchHandler = async () => {
  const mealId = localStorage.getItem("currentMeal");
  const result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${
      mealId ? mealId : 52910
    }`
  );

  const data = await result.json();
  console.log(data.meals[0].strMeal);

  const html = `
    <div class="display">
      <h1 class="meal_heading">${data.meals[0].strMeal}</h1>
      <p class="meal_text">${data.meals[0].strInstructions}</p>
      <div class="buttons">
        <a href="#" class="btn">order now</a>
        <a target="_blank"  href="${data.meals[0].strSource}" class="btn">Make It</a>
        <a target="_blank"  href="${data.meals[0].strYoutube}" class="btn">Vedio</a>
      </div>
    </div>
    <div class="meal_img">
      <img src="${data.meals[0].strMealThumb}" alt="Meal image" />
    </div>
  `;

  document
    .querySelector(".meal_display")
    .insertAdjacentHTML("afterbegin", html);

  localStorage.clear("currentMeal");
};
searchHandler();
