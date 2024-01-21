const ordersList = document.querySelector("#orders")
const orderDialog = document.querySelector("#order-dialog")
const orderDialogTime = document.querySelector("#order-dialog-time")
const orderDialogItems = document.querySelector("#order-dialog-items")

const orderDialogCloseOrderButton = document.querySelector("#order-dialog-close-order-btn")
const orderDialogCancelOrderButton = document.querySelector("#order-dialog-cancel-order-btn")
const orderDialogCloseButton = document.querySelector("#order-dialog-close-btn")

var active_orders = new Map();

var currentOrder = null

orderDialogCloseButton.addEventListener("click", () => {
    orderDialog.close()
})

orderDialogCancelOrderButton.addEventListener("click", () => {
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/orders/cancel",
        data: JSON.stringify(currentOrder),
        dataType: "json",
        contentType: "application/json",
        success: () => {
            pollOrders()
        }
    })
    orderDialog.close()
})

orderDialogCloseOrderButton.addEventListener("click", () => {
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/orders/close",
        data: JSON.stringify(currentOrder),
        dataType: "json",
        contentType: "application/json",
        success: () => {
            pollOrders()
        }
    })
    orderDialog.close()
})

function revealOrderDialog(order) {
    orderDialog.children[0].children[0].textContent = `Order id: ${order.order_id}`
    orderDialogTime.textContent = prettyOrderDate(order.timestamp)
    orderDialogItems.innerHTML = itemsToHtml(order.items, false)
    orderDialog.showModal()
}

function updateOrderHandlers() {
    const orders = document.querySelectorAll(".order")

    orders.forEach((order) => {
        order.addEventListener("click", () => {
            currentOrder = active_orders.get(Number(order.children[1].textContent.split(' ')[2]))
            revealOrderDialog(currentOrder)
        })
    })
}
function prettyOrderDate(timestamp) {
    const time = new Date(timestamp)
    return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`
}

function updateOrders(orders) {
    var res = ""
    orders.forEach((order, key) => {
        items = itemsToHtml(order.items)

        res += `
        <div class="grid-order">
            <div class="order">
                <h1 class="order-header">${prettyOrderDate(order.timestamp)}</h1>
                <p class="order-order-id">Order id: ${order.order_id}</p>
                <ul class="order-items">
                    ${items}
                </ul>
            </div>
        </div>
        `
    })

    ordersList.innerHTML = res
    updateOrderHandlers()
}

function pollOrders() {
    $.get("http://localhost:8080/api/orders/active").done((response) => {
        active_orders.clear()
        response.forEach((el) => {
            active_orders.set(el.order_id, el)
        })
        updateOrders(active_orders)
    })
}

pollOrders()
