const ingredientDialog = document.querySelector("#ingredient-dialog")
const ingredientIncreaseInput = document.querySelector("#ingredient-increase-input")
const ingredientReasonInput = document.querySelector("#ingredient-reason-input")
const ingredientChangeAmountButton = document.querySelector("#ingredient-change-amount-btn")
const ingredientCloseButton = document.querySelector("#ingredient-close-btn")

var currentIngredient = null

ingredientCloseButton.addEventListener("click", () => {
    ingredientDialog.close()
})

var onIncrease = () => { }

function setOnIncrease(handler) {
    onIncrease = handler
}

function performIncrease(ingredient, increase, reason_id) {
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/ingredients/operation",
        data: JSON.stringify({
            "ingredient_id": ingredient.ingredient_id,
            "increase": increase,
            "reason_id": reason_id
        }),
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
            pollIngredients()
            onIncrease()
        }
    })
}

ingredientChangeAmountButton.addEventListener("click", () => {
    if (!ingredientIncreaseInput.value) {
        ingredientIncreaseInput.setCustomValidity("Increase must be not empty")
        ingredientIncreaseInput.reportValidity()
    } else {
        performIncrease(currentIngredient, ingredientIncreaseInput.value, ingredientReasonInput.value)
        ingredientDialog.close()
    }
})

function revealIngredientDialog(ingredient) {
    pollReasons()
    ingredientDialog.children[0].children[0].textContent = ingredient.name
    ingredientDialog.children[0].children[1].textContent = `Current amount: ${ingredient.amount} ${ingredient.units}`

    currentIngredient = ingredient

    ingredientDialog.showModal()
}

const ingredientsButton = document.querySelector("#ingredients-btn")
ingredientsButton.addEventListener("click", () => {
    addIngredientDialog.showModal()
    setIngredientClickHandler((element) => {
        addIngredientDialog.close()
        revealIngredientDialog(ingredient_list.get(element.children[0].textContent))
    })
})

var reasons = new Map()

function updateReasons(reasons) {
    res = ''
    reasons.forEach((reasons) => {
        res += `
            <option value=${reasons.reason_id}>${reasons.reason}</option>
        `
    });

    ingredientReasonInput.innerHTML = res
}

function pollReasons() {
    $.get("http://localhost:8080/api/ingredients/reasons").done((response) => {
        reasons.clear()
        response.forEach(
            (el) => {
                reasons.set(el.reason_id, el)
            }
        )
        updateReasons([...reasons.values()].filter((el) => { return el.reason != 'sql_update' }))
    })
}
pollReasons()

const createIngredientButton = document.querySelector("#create-ingredient-btn")
const createIngredientDialog = document.querySelector("#create-ingredient-dialog")
const createIngredientNameInput = document.querySelector("#create-ingredient-name-input")
const createIngredientAmountInput = document.querySelector("#create-ingredient-amount-input")
const createIngredietnUnitsInput = document.querySelector("#create-ingredient-units-input")
const createIngredientCreateButton = document.querySelector("#create-ingredient-create-btn")
const createIngredientCancelButton = document.querySelector("#create-ingredient-cancel-btn")

units = []

function updateUnits(units) {
    res = ''
    units.forEach((el) => {
        res += `
            <option value="${el.name}">${el.name}</option>
        `
    })
    createIngredietnUnitsInput.innerHTML = res
}

function pollUnits() {
    $.get("http://localhost:8080/api/ingredients/units").done((response) => {
        units = response
        updateUnits(units)
    })
}
pollUnits()

createIngredientButton.addEventListener("click", () => {
    createIngredientDialog.showModal()
})

createIngredientCancelButton.addEventListener("click", () => {
    createIngredientDialog.close()
})

function createIngredient(ingredient) {
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/ingredients/add",
        data: JSON.stringify(ingredient),
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
            pollIngredients()
        }
    })
}

createIngredientCreateButton.addEventListener("click", () => {
    if (!createIngredientNameInput.value) {
        createIngredientNameInput.setCustomValidity("Ingredient name must be not empty")
        createIngredientNameInput.reportValidity()
    } else if (!createIngredientAmountInput.value) {
        createIngredientAmountInput.setCustomValidity("Initial amount must be not empty")
        createIngredientAmountInput.reportValidity()
    } else {
        createIngredient({
            "name": createIngredientNameInput.value,
            "init_amount": createIngredientAmountInput.value,
            "units": createIngredietnUnitsInput.value
        })
        createIngredientDialog.close()
    }
})