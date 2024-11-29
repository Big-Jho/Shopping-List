const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemFilter = document.getElementById("filter");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const addItemBtn = itemForm.querySelector(".btn");
let isEditMode = false;

// Display Item To Dom on DOMContentLoading
const displayItemsToDom = () => {
  const itemInStorage = getItemInStorage();
  itemInStorage.forEach((item) => addItemToDom(item));

  checkUI();
};

// Add Items to the ItemList
const addItemSubmit = (event) => {
  event.preventDefault();
  const newItem = itemInput.value;
  const itemInStorage = getItemInStorage();

  // Form Validation
  if (newItem === "") {
    alert("Please Add an Item");
    return;
  } else if (itemInStorage.includes(newItem)) {
    alert("This Item Already Exist");
    return;
  } else {
    console.log(itemInStorage.includes(newItem));
    addItemToDom(newItem);
    addItemToStorage(newItem);
  }

  itemInput.value = "";

  removeEditedItem();
  checkUI();
};

const createButton = (classes) => {
  const newButton = document.createElement("button");
  newButton.className = classes;
  return newButton;
};

const createIcon = (classes) => {
  const newIcon = document.createElement("icon");
  newIcon.className = classes;
  return newIcon;
};

// Check for Duplicate Item
// const checkForDuplicateItem = (newItem) => {
//   const itemInStorage = getItemInStorage();
// };

// Adding Items To DOM
const addItemToDom = (newItem) => {
  const li = document.createElement("li");
  const text = document.createTextNode(newItem);
  const button = createButton("remove-item btn-link text-red");
  const icon = createIcon("fa-solid fa-xmark");

  li.appendChild(text);
  button.appendChild(icon);
  li.appendChild(button);
  itemList.appendChild(li);
};

// Adding Items to storage
const addItemToStorage = (newItem) => {
  const itemInStorage = getItemInStorage();

  itemInStorage.push(newItem);
  localStorage.setItem("items", JSON.stringify(itemInStorage));
};

// Retrieving Items Array from Storage
const getItemInStorage = () => {
  let itemInStorage = localStorage.getItem("items");
  if (itemInStorage === null) {
    itemInStorage = [];
    localStorage.setItem("items", JSON.stringify(itemInStorage));
    return itemInStorage;
  } else {
    itemInStorage = JSON.parse(localStorage.getItem("items"));
    return itemInStorage;
  }
};

// Filtering Items on itemFilter Input
const filterItems = (event) => {
  const text = event.target.value.toLowerCase();

  const li = itemList.querySelectorAll("li");
  li.forEach((item) => {
    const itemName = item.firstChild.textContent.toLocaleLowerCase();

    if (itemName.indexOf(text) !== -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
};

// Clear All Items
const clearAllItem = () => {
  const confirmDelete = confirm("Are you sure you delete all Items?");

  if (confirmDelete) {
    while (itemList.firstChild) {
      // Removing all Item from the DOM
      itemList.removeChild(itemList.firstChild);

      // Clearing all item from storage
      // localStorage.removeItem("items");

      ////////     OR     /////////

      let itemInStorage = [];
      localStorage.setItem("items", JSON.stringify(itemInStorage));
    }
  }

  checkUI();
};

// On Click Item
const onClickItem = (event) => {
  if (event.target.parentNode.classList.contains("remove-item")) {
    const item = event.target.parentNode.parentElement;
    // const btn = event.target.parentNode;
    removeItemFromDom(item);
    removeItemFromStorage(item.innerText);
  } else if (event.target.tagName === "LI") {
    editModeUI(event);
  }

  checkUI();
};

const editModeUI = (event) => {
  const item = event.target;
  itemInput.value = item.textContent;

  item.classList.add("edit-mode");
  addItemBtn.style.backgroundColor = "Green";
  addItemBtn.innerHTML = `<i class = 'fas fa-pencil'></i>  Update Item`;

  itemList.querySelectorAll("li").forEach((item) => {
    if (itemInput.value !== item.textContent) {
      item.classList.remove("edit-mode");
    }
  });

  itemList.querySelectorAll("li").forEach((i) => {
    if (i.classList.contains("edit-mode")) {
      removeItemFromStorage(i.textContent);
    }
  });
};

const removeEditedItem = () => {
  itemList.querySelectorAll("li").forEach((item) => {
    if (item.classList.contains("edit-mode")) {
      item.remove();
    }
  });

  addItemBtn.style.backgroundColor = "Black";
  addItemBtn.innerHTML = `<i class ="fa-solid fa-plus"></i> Add Item`;
};

// Remove Item Fron DOM
const removeItemFromDom = (item) => {
  const confirmDelete = confirm("Do you really want to delete ths Item?");
  if (confirmDelete) {
    item.remove();
  }
};

// Remove Item from Storage
const removeItemFromStorage = (item) => {
  let itemInStorage = getItemInStorage();

  // console.log(itemInStorage[0]);

  itemInStorage = itemInStorage.filter((i) => i != item);
  // console.log(itemInStorage);

  localStorage.setItem("items", JSON.stringify(itemInStorage));
};

// Removing Filter and clearBtn if there is no list item
const checkUI = () => {
  if (itemList.children.length === 0) {
    itemFilter.style.display = "none";
    clearBtn.style.display = "none";
  } else {
    itemFilter.style.display = "block";
    clearBtn.style.display = "block";
  }
};

// EventListeners
function initApp() {
  itemForm.addEventListener("submit", addItemSubmit);
  clearBtn.addEventListener("click", clearAllItem);
  itemList.addEventListener("click", onClickItem);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItemsToDom);

  checkUI();
}

initApp();
