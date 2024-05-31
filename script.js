let order = [];
let orders = [];
let lastOrderNumber = 0;
let salesSummary = {};

function addItem(name, price) {
    const item = order.find(product => product.name === name);
    if (item) {
        item.quantity += 1;
    } else {
        order.push({ name, price, quantity: 1 });
    }
    updateOrderList();
}

function updateOrderList() {
    const orderList = document.getElementById('selected-products');
    orderList.innerHTML = '';
    let totalPrice = 0;

    order.forEach(product => {
        const itemElement = document.createElement('li');
        itemElement.textContent = `${product.name} - $${product.price.toFixed(2)} x ${product.quantity}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => removeItem(product.name);
        itemElement.appendChild(deleteButton);
        orderList.appendChild(itemElement);

        totalPrice += product.price * product.quantity;
    });

    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
    calculateChange();
}

function removeItem(name) {
    order = order.filter(product => product.name !== name);
    updateOrderList();
}

function clearOrder() {
    order = [];
    updateOrderList();
}

function completeOrder() {
    const orderNumber = ++lastOrderNumber;
    const orderDetails = order.map(product => ({
        name: product.name,
        price: product.price,
        quantity: product.quantity
    }));
    const totalPrice = order.reduce((total, product) => total + product.price * product.quantity, 0);
    const orderDate = new Date().toLocaleString();

    const newOrder = {
        orderNumber,
        date: orderDate,
        items: orderDetails,
        total: totalPrice
    };

    orders.push(newOrder);
    updateSalesSummary(orderDetails);
    clearOrder();
}

function calculateChange() {
    const amountPaid = parseFloat(document.getElementById('amount-paid').value) || 0;
    const totalPrice = parseFloat(document.getElementById('total-price').textContent);
    const change = amountPaid - totalPrice;
    document.getElementById('change').textContent = change.toFixed(2);
}

function updateSalesSummary(orderDetails) {
    orderDetails.forEach(product => {
        if (!salesSummary[product.name]) {
            salesSummary[product.name] = { quantity: 0, sales: 0 };
        }
        salesSummary[product.name].quantity += product.quantity;
        salesSummary[product.name].sales += product.price * product.quantity;
    });

    renderSalesSummary();
}

function renderSalesSummary() {
    const salesSummaryList = document.getElementById('sales-summary');
    salesSummaryList.innerHTML = '';

    let totalSales = 0;
    for (const [name, data] of Object.entries(salesSummary)) {
        const itemElement = document.createElement('li');
        itemElement.textContent = `${name}: ${data.quantity} items - $${data.sales.toFixed(2)}`;
        salesSummaryList.appendChild(itemElement);
        totalSales += data.sales;
    }

    document.getElementById('total-sales').textContent = totalSales.toFixed(2);
}

function confirmSaveAllOrders() {
    if (confirm("Guardar todo??")) {
        saveAllOrders();
    }
}

function saveAllOrders() {
    const blob = new Blob([JSON.stringify(orders, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'orders.json';
    link.click();
}
