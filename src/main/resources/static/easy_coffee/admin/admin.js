const addItemDialog = document.querySelector("#add-item-dialog")
const addItemButton = document.querySelector("#add-item-btn")
const addItemDialogCloseButton = document.querySelector("#add-item-dialog-close-btn")
const addItemDialogIngredientList = document.querySelector("#add-item-ingredients")
const addItemDialogAddIngredientButton = document.querySelector("#add-item-add-ingredient-btn")
const addItemSubmitButton = document.querySelector("#add-item-submit-btn")
const addItemForm = document.querySelector("#add-item-form")
const addItemInputName = document.querySelector("#add-item-input-name")
const addItemInputDescription = document.querySelector("#add-item-input-description")
const addItemInputCost = document.querySelector("#add-item-input-cost")

addItemButton.addEventListener("click", () => {
    addItemDialog.showModal();
})

addItemDialogCloseButton.addEventListener("click", () => {
    addItemDialog.close();
})

var add_item_ingredient_list = new Set();

addItemDialogAddIngredientButton.addEventListener("click", () => {
    addIngredientDialogIngredientListUpdate(new Set([...ingredient_list.values()].filter(x => !add_item_ingredient_list.has(x))))

    setIngredientClickHandler(
        (element) => {
            ingredient_list.forEach((ingredient, key) => {
                if (ingredient.name == element.childNodes[1].textContent) {
                    add_item_ingredient_list.add(ingredient)
                }
            })
            addItemIngredientListUpdate(add_item_ingredient_list)
            addIngredientDialog.close()
        })

    addIngredientDialog.showModal();
})

function addItemIngredientsUpdateHandlers() {
    const ingredients = document.querySelectorAll(".add-item-ingredient")

    ingredients.forEach((element) => {
        element.children[2].addEventListener("click", () => {
            add_item_ingredient_list.forEach((ingredient, key) => {
                if (ingredient.name == element.children[0].textContent) {
                    add_item_ingredient_list.delete(ingredient)
                }
            })
            addItemIngredientListUpdate(add_item_ingredient_list)
        })
    })
}

function addItemIngredientListUpdate(ingredient_list) {
    res = "";
    ingredient_list.forEach((element, key) => {
        res += `
        <div class="add-item-ingredient">
            <p>${element.name}</p>
            <input class="add-item-ingredient-input" type="number" step="0.01" min="0">
            <button type="button">remove</button>
        </div>
        `
    });
    addItemDialogIngredientList.innerHTML = res;

    addItemIngredientsUpdateHandlers();
}

addItemIngredientsUpdateHandlers();

function getIngredientWithAmounts() {
    const ingredients = document.querySelectorAll(".add-item-ingredient")

    res = []
    ingredients.forEach((ingredient) => {
        id = -1;
        ingredient_list.forEach((i, key) => {
            if (i.name == ingredient.children[0].textContent) {
                id = i.ingredient_id
            }
        })
        res.push({
            ingredient_id: id,
            amount: ingredient.children[1].value
        })
    })

    return res
}

addItemSubmitButton.addEventListener("click", () => {
    if (add_item_ingredient_list.size == 0) {
        addItemInputName.setCustomValidity("Add at least 1 ingredient")
    } else {
        addItemInputName.setCustomValidity("")
    }

    if (addItemForm.checkValidity()) {
        o = {
            name: addItemInputName.value,
            description: addItemInputDescription.value,
            price: addItemInputCost.value,
            ingredients: getIngredientWithAmounts()
        }
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/menuitems",
            data: JSON.stringify(o),
            dataType: "json",
            contentType: "application/json",
            success: function (response) {
                setTimeout(() => { pollItems() }, 500)
            }
        }).always(() => {
            addItemDialog.close()

            addItemSubmitButton.disabled = false
            addItemDialogAddIngredientButton.disabled = false
        });
        addItemSubmitButton.disabled = true
        addItemDialogAddIngredientButton.disabled = true
    } else {
        addItemForm.reportValidity()
    }
})

setOnIncrease(() => {
    pollStopList()
})

const ingredientHistoryDialog = document.querySelector("#ingredient-history-dialog")
const ingredientHistoryButton = document.querySelector("#ingredient-history-btn")
const ingredientHistoryOkButton = document.querySelector("#ingredient-history-ok-btn")
const ingredientHistoryItems = document.querySelector("#ingredient-history-items")

function updateIngredientHistory(history) {
    res = ''
    history.forEach((el) => {
        console.log(reasons)
        console.log(el.reason_id)
        res += `
        <li>
            <div class="ingredient-history-item">
                <p>${new Date(el.timestamp).toLocaleString()}</p>
                <p class="ingredient-history-increase">${el.increase}</p>
                <p class="ingredient-history-reason">${reasons.get(el.reason_id).reason}</p>
            </div>
        </li>
        `
    })
    ingredientHistoryItems.innerHTML = res
}

function pollIngredientHistory(ingredient, callback) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/ingredients/operation",
        data: {
            "ingredient_id": ingredient.ingredient_id
        },
        success: (response) => {
            console.log(response)
            updateIngredientHistory(response)
        }
    })
}

function revealIngredientHistory(ingredient) {
    pollIngredientHistory(ingredient)
    ingredientHistoryDialog.children[0].children[0].textContent = ingredient.name

    ingredientHistoryDialog.showModal()
}

ingredientHistoryButton.addEventListener("click", () => {
    addIngredientDialogIngredientListUpdate(new Set([...ingredient_list.values()]))

    setIngredientClickHandler((element) => {
        revealIngredientHistory(ingredient_list.get(element.children[0].textContent))
        addIngredientDialog.close()
    })
    pollIngredients()
    addIngredientDialog.showModal();
})

ingredientHistoryOkButton.addEventListener("click", () => {
    ingredientHistoryDialog.close()
})

const ordersHistoryDialog = document.querySelector("#orders-history-dialog")
const ordersHistoryItems = document.querySelector("#orders-history-items")
const ordersHistoryOkButton = document.querySelector("#orders-history-ok-btn")
const ordersHistoryButton = document.querySelector("#orders-history-btn")

function updateOrdersHistory(orders) {
    var res = ''
    orders.forEach((order) => {
        var items = ''
        order.items.forEach((item) => {
            items += `
                <li>
                    <div class="orders-history-item-item">
                        <h2 class="order-item-name">${item.item.name}</h2>
                        <p>x${item.amount}</p>
                    </div>
                </li>
            `
        })

        res += `
        <li>
            <div class="orders-history-item">
                <div class="orders-histoty-item-headers">
                    <h3>${new Date(order.order.timestamp).toLocaleString()}</h3>
                    <h3>${order.order.status}</h3>
                </div>
                <ul>
                    ${items}
                </ul>
            </div>
        </li>
        `
    })
    ordersHistoryItems.innerHTML = res
}

function pollOrdersHistory() {
    $.get("http://localhost:8080/api/orders/history").done((response) => {
        updateOrdersHistory(response)
    })
}

ordersHistoryButton.addEventListener("click", () => {
    pollOrdersHistory()
    ordersHistoryDialog.showModal()
})

ordersHistoryOkButton.addEventListener("click", () => {
    ordersHistoryDialog.close()
})