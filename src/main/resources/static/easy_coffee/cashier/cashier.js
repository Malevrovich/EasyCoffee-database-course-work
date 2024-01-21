const itemDialog = document.querySelector("#item-dialog")
const itemDialogName = document.querySelector("#item-dialog-name")
const itemDialogDescription = document.querySelector("#item-dialog-description")
const itemDialogCloseButton = document.querySelector("#item-dialog-close-btn")
const itemDialogAddButton = document.querySelector("#item-dialog-add-btn")
const itemDialogAddToStopListButton = document.querySelector("#item-dialog-add-to-stoplist-btn")

const items = new Map();
var currentItem = null

function revealDialog(item) {
    itemDialogName.textContent = item.name
    itemDialogDescription.textContent = item.description
    itemDialog.showModal()
}

var total = 0;
var items_in_order = [];

const orderitemList = document.querySelector("#order-items")
const orderTotal = document.querySelector("#order-sum")
const orderClearButton = document.querySelector("#clear-order-btn")
const orderPostButton = document.querySelector("#post-order-btn")

function updateItemsInOrderHandlers() {
    document.querySelectorAll(".order-item").forEach((element) => {
        element.children[2].children[0].addEventListener("click", () => {
            items_in_order.forEach((el) => {
                if (el.item.name == element.children[0].textContent) {
                    if (el.amount == 1) {
                        return
                    }
                    el.amount -= 1;
                    total -= el.item.price
                    element.children[2].children[1].textContent = `${el.amount}`;
                    updateTotal(total)
                }
            });
        });

        element.children[2].children[2].addEventListener("click", () => {
            items_in_order.forEach((el) => {
                if (el.item.name == element.children[0].textContent) {
                    el.amount += 1
                    total += el.item.price
                    element.children[2].children[1].textContent = `${el.amount}`;
                    updateTotal(total)
                }
            });
        });

        element.children[3].addEventListener("click", () => {
            items_in_order = items_in_order.filter((item) => {
                return item.item.name != element.children[0].textContent
            });
            updateItemsInOrder(items_in_order)
        });
    })
}

function updateTotal(total) {
    orderTotal.children[0].textContent = `Total: ${total}$`
}

function updateItemsInOrder(items) {
    var res = ""
    items.forEach((element) => {
        res += `
        <div class="order-item">
            <h1 class="order-item-header">${element.item.name}</h1>
            <p>${element.item.price}$</p>
            <div class="amount">
                <button class="amountbtn">-</button>
                <p>${element.amount}</p>
                <button class="amountbtn">+</button>
            </div>
            <button class="order-delete-btn">
                Delete
            </button>
        </div>
        `
    });
    orderitemList.innerHTML = res;

    total = 0;
    items.forEach((element) => {
        total += element.amount * element.item.price
    })
    updateTotal(total)
    updateItemsInOrderHandlers();
}

function addItem(item) {
    res = items_in_order.find((el) => { return el.item.name == item.name })
    if (res) {
        res.amount += 1
    } else {
        items_in_order.push({
            item: item,
            amount: 1
        });
    }
    updateItemsInOrder(items_in_order)
}

itemDialogCloseButton.addEventListener("click", () => {
    itemDialog.close()
})

itemDialogAddButton.addEventListener("click", () => {
    addItem(currentItem)
    itemDialog.close()
    currentItem = null
})

orderClearButton.addEventListener("click", () => {
    items_in_order = []
    updateItemsInOrder(items_in_order)
})

function postOrder(items_in_order, successCallback, errorCallback) {
    const items = []

    items_in_order.forEach((el) => {
        for (var i = 0; i < el.amount; ++i) {
            items.push(el.item.name)
        }
    })

    const req = $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/orders/create",
        data: JSON.stringify(items),
        dataType: "json",
        contentType: "application/json"
    })

    req.done(successCallback)
    req.fail(errorCallback)
}

orderPostButton.addEventListener("click", () => {
    if (items_in_order.length == 0) {
        orderPostButton.setCustomValidity("Unable to post empty order!")
        orderPostButton.reportValidity()
        return
    }
    orderPostButton.disabled = true
    postOrder(items_in_order,
        successCallback = (response) => {
            orderPostButton.disabled = false
            items_in_order = []
            updateItemsInOrder(items_in_order)
        },
        errorCallback = () => {
            orderPostButton.disabled = false
            orderPostButton.setCustomValidity("Post failed! Try to check stop list")
            orderPostButton.reportValidity()
        })
})

const stopListDialog = document.querySelector("#stoplist-dialog");
const stopListButton = document.querySelector("#stoplist-btn");
const stopListDialogButton = document.querySelector("#stoplist-dialog-close-btn")
const stopListItems = document.querySelector("#stoplist-items")
const removeFromStopListDialog = document.querySelector("#remove-from-stoplist-dialog")
const removeFromStopListCancelButton = document.querySelector("#remove-from-stoplist-cancel-btn")
const removeFromStopListRemoveButton = document.querySelector("#remove-from-stoplist-remove-btn")

const addToStopListDialog = document.querySelector("#add-to-stoplist-dialog")
const addToStopListCancelButton = document.querySelector("#add-to-stoplist-cancel-btn")
const addToStopListAddButton = document.querySelector("#add-to-stoplist-add-btn")
const addToStopListReasonInput = document.querySelector("#add-to-stoplist-reason-input")

var stop_list = []

function addToStopList(item, reason) {
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/stoplist/add",
        data: JSON.stringify({
            name: item,
            reason: reason
        }),
        dataType: "json",
        contentType: "application/json",
        success: () => {
            pollStopList()
        }
    })
}

addToStopListAddButton.addEventListener("click", () => {
    if (addToStopListReasonInput.value) {
        addToStopList(currentItem.name, addToStopListReasonInput.value)
        addToStopListReasonInput.value = ""
        addToStopListDialog.close()
    } else {
        addToStopListReasonInput.setCustomValidity("Reason must be not empty")
        addToStopListReasonInput.reportValidity()
    }
})

addToStopListCancelButton.addEventListener("click", () => {
    addToStopListDialog.close()
})

itemDialogAddToStopListButton.addEventListener("click", () => {
    addToStopListDialog.children[0].children[1].textContent = currentItem.name
    addToStopListDialog.showModal()
    itemDialog.close()
})

function removeFromStopList(item) {
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/stoplist/remove",
        data: JSON.stringify({
            name: item
        }),
        dataType: "json",
        contentType: "application/json",
        success: () => {
            pollStopList()
        }
    })
}

removeFromStopListRemoveButton.addEventListener("click", () => {
    removeFromStopList(removeFromStopListDialog.children[0].children[1].textContent)
    removeFromStopListDialog.close()
})

removeFromStopListCancelButton.addEventListener("click", () => {
    removeFromStopListDialog.close()
})

function revealRemoveFromStopListDialog(item) {
    removeFromStopListDialog.children[0].children[1].textContent = item.name
    removeFromStopListDialog.showModal()
}

function updateStopListHandlers() {
    document.querySelectorAll(".stoplist-item").forEach(
        (element) => {
            element.addEventListener("click", () => {
                revealRemoveFromStopListDialog(items.get(element.children[0].textContent))
                stopListDialog.close()
            })
        }
    )
}

function updateStopList(stop_list) {
    var res = ''
    stop_list.forEach((element) => {
        res += `
        <div class="stoplist-item">
            <h1>${element}</h1>
        </div>
        `
    })
    stopListItems.innerHTML = res
    updateStopListHandlers()
}

function pollStopList() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/stoplist",
        dataType: "json",
        success: function (response) {
            stop_list = []
            response.forEach((el) => {
                stop_list.push(el)
            })
            updateStopList(stop_list)
            updateItemList(items)
        }
    });
}
pollStopList()

stopListButton.addEventListener("click", () => {
    pollStopList()
    stopListDialog.showModal();
})

stopListDialogButton.addEventListener("click", () => {
    stopListDialog.close()
})

const itemList = document.querySelector("#items")

function updateItemsHandlers() {
    const itemButtons = document.querySelectorAll(".item")

    itemButtons.forEach((button) => {
        button.addEventListener("click", () => {
            currentItem = items.get(button.children[0].textContent)
            revealDialog(currentItem)
        })
    })
}

function updateItemList(items) {
    res = ""
    items.forEach((value, key) => {
        if (stop_list.indexOf(key) == -1) {
            res += `
            <div class="grid-item">
                <div class="item">
                    <h1 class="grid-header">${value.name}</h1>
                    <p>${value.price}$</p>
                </div>
            </div>
            `
        }
    })
    itemList.innerHTML = res
    updateItemsHandlers()
}

function pollItems() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/menuitems",
        dataType: "json",
        success: function (response) {
            items.clear()
            response.forEach((element) => {
                items.set(element.name, element)
            });
            updateItemList(items)
        }
    });
}

pollItems();

const cancelOrderDialog = document.querySelector("#cancel-order-dialog")
const cancelOrderButton = document.querySelector("#cancel-order-btn")
const cancelOrderDialogCloseButton = document.querySelector("#cancel-order-dialog-close-btn")
const cancelOrderItems = document.querySelector("#cancel-order-items")

const active_orders = new Map()


function cancelOrder(order) {
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/orders/cancel",
        data: JSON.stringify(order),
        dataType: "json",
        contentType: "application/json",
        success: () => {
            pollActiveOrders()
        }
    })
}

function updateActiveOrdersHandlers() {
    document.querySelectorAll(".cancel-order-item").forEach((order) => {
        order.addEventListener("click", () => {
            cancelOrder(active_orders.get(order.children[0].textContent))
            cancelOrderDialog.close()
        })
    })
}

function updateActiveOrders(orders) {
    res = ""
    orders.forEach((value, key) => {
        res += `
        <div class="cancel-order-item">
            <p>${value.timestamp}</p>
        </div>
        `
    })
    cancelOrderItems.innerHTML = res

    updateActiveOrdersHandlers()
}

function pollActiveOrders() {
    $.get("http://localhost:8080/api/orders/active").done((response) => {
        active_orders.clear()
        response.forEach((el) => {
            active_orders.set(el.timestamp, el)
        })
        updateActiveOrders(active_orders)
    })
}
pollActiveOrders()

cancelOrderButton.addEventListener("click", () => {
    pollActiveOrders()
    cancelOrderDialog.showModal()
})

cancelOrderDialogCloseButton.addEventListener("click", () => {
    cancelOrderDialog.close()
})
