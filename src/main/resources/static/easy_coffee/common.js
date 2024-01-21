
const addIngredientDialog = document.querySelector("#ingredient-list-dialog")
const addIngredientDialogIngredientList = document.querySelector("#ingredient-list-items")
const addIngredientDialogCloseButton = document.querySelector("#ingredient-list-dialog-close-btn")

var ingredientClickHandler = (element) => { }

function setIngredientClickHandler(handler) {
    ingredientClickHandler = handler
}

function addIngredientDialogUpdateHandlers() {
    const addIngredientDialogIngredients = document.querySelectorAll(".ingredient-list-item")

    addIngredientDialogIngredients.forEach((element) => {
        element.addEventListener("click", () => {
            ingredientClickHandler(element)
        })
    })
}

function addIngredientDialogIngredientListUpdate(ingredient_list) {
    res = "";
    ingredient_list.forEach((element, key) => {
        res += `
        <div class="ingredient-list-item">
            <p>${element.name}</p>
        </div>
        `
    });
    addIngredientDialogIngredientList.innerHTML = res;
    addIngredientDialogUpdateHandlers();
}

addIngredientDialogUpdateHandlers();

addIngredientDialogCloseButton.addEventListener("click", () => {
    addIngredientDialog.close();
})

var ingredient_list = new Map();

function pollIngredients() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/ingredients",
        dataType: "json",
        success: function (response) {
            ingredient_list.clear()
            response.forEach((element) => {
                ingredient_list.set(element.name, element)
            })
            addIngredientDialogIngredientListUpdate(ingredient_list)
        }
    });
}

pollIngredients()

function itemsToHtml(items, checkboxes = true) {
    var res = '<ul>'

    order_items = new Map()

    items.forEach((item) => {
        amount = order_items.get(item)
        if (!amount) {
            amount = 0
        }
        order_items.set(item, ++amount)
    })

    var checkbox = ""
    if (checkboxes) {
        checkbox = '<input class="order-item-check" type="checkbox" />'
    }

    order_items.forEach((value, key) => {
        res += `
        <li>
            <div class="order-item">
                <h2 class="order-item-name">${key}</h2>
                <p>x${value}</p>
                ${checkbox}
            </div>
        </li>
        `
    })

    return res
}
