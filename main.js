// ELEMENTS
const menuList = document.querySelector(".menu");
const loading = document.querySelector(".loading");
const searchInput = document.getElementById("search-input");
const buttonsContainer = document.querySelector(".buttons-container");
// EVENTS
searchInput.addEventListener("input", searchItemByName);

// STORE MENU ITEMS FROM API
let menuItems = null;

// FUNCTION TO GET ITEMS FROM API
const fetchMenuItems = async () => {
  try {
    const response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/search.php?s"
    );
    const data = await response.data;
    menuItems = data.meals;

    // GET ALL CATEGORIES TO CREATE BUTTON BY ITS NAME
    const category = menuItems.reduce(
      (acc, item) => {
        if (!acc.includes(item.strCategory)) {
          acc.push(item.strCategory);
        }
        return acc;
      },
      ["All"]
    );

    // CREATE BUTTON FOR EACH CATEGORY
    createCateforyButtons(category);

    loading.style.display = "none"; // HIDE LOADING WHEN DATA ARRIVED

    displayMenuItems(menuItems);
  } catch (error) {
    menuList.innerHTML = `<h2 class='not-found-text'>${error.message}</h2>`;
  }
};

// FUNCTION TO SHOW  ITEMS
const displayMenuItems = (items) => {
  menuList.innerHTML = "";
  // NO ITEM EXITS
  if (items.length === 0) {
    menuList.innerHTML = `<h2 class="not-found-text">Item Doesnt Exits </h2>`;
  }

  items.map((item) => {
    // console.log(item);
    const menuItem = `
      <div class="menu-item">
        <img class="menu-img" src=${item.strMealThumb} alt=${item.strMeal}  />
        <h3>${item.strMeal}</h3>
      </div>
    `;
    menuList.innerHTML += menuItem;
  });
};

// SEARCH MENU ITEMS BY ITS NAME
function searchItemByName() {
  const searchedText = searchInput.value.toLowerCase().trim();

  const filteredItems = menuItems.filter((item) => {
    const matchedItems = item.strMeal.toLowerCase().includes(searchedText);
    return matchedItems;
  });
  // UPDATE MENU LIST
  displayMenuItems(filteredItems);
}
// FUNCTION TO CREATE CATEGORY BUTTONS
const createCateforyButtons = (category) => {
  category.map((category) => {
    const button = `
    <button type="button"
      data-category='${category}'
      onClick="filterItemsByCategory(this)"
      class="filter-btn">${category}</button>
    `;
    buttonsContainer.innerHTML += button;
  });
};
const filterItemsByCategory = (btn) => {
  const category = btn.dataset.category;

  const filteredItems = menuItems.filter((item) => {
    const matchedItems =
      item.strCategory.toLowerCase() === category.toLowerCase();
    return matchedItems;
  });
  searchInput.value= '';
  displayMenuItems(filteredItems);

  // SHOW ALL ITEMS WHEN CLICK TO ALL BUTTONS
  if (category === "All") {
    displayMenuItems(menuItems);
  }
};
fetchMenuItems();
