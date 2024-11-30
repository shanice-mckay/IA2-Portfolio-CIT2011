// Global array to store the cart
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Add products to the cart
function addToCart(productName, price) {
    cart.push({ productName, price });
    updateCart(); // Update cart display and totals
    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
}

// update the cart display
function updateCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');

    // conditional statement for function
    if (!cartItemsDiv || !subtotalElement || !taxElement || !totalElement) return;

    // Clear previous cart items
    cartItemsDiv.innerHTML = '';

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        subtotalElement.textContent = '0.00';
        taxElement.textContent = '0.00';
        totalElement.textContent = '0.00';
        return;
    }

    let subtotal = 0;
    cart.forEach((item) => {
        const itemElement = document.createElement('p');
        itemElement.innerHTML = `${item.productName} - $${item.price}`;
        cartItemsDiv.appendChild(itemElement);
        subtotal += item.price;
    });

    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal + tax;

    // Update subtotal, tax, total
    subtotalElement.textContent = subtotal.toFixed(2);
    taxElement.textContent = tax.toFixed(2);
    totalElement.textContent = total.toFixed(2);
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    // Store cart for invoice page
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'invoice.html'; // Redirect to invoice page
}


// cancel/clear the cart
function cancelCart() {
    if (confirm("Are you sure you want to clear your cart?")) {
        cart = []; // Clear the cart
        localStorage.removeItem('cart'); // Remove cart from local storage
        updateCart(); // Update cart display
    }
}

// generate the invoice page
function generateInvoice() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]'); // Retrieve cart data
    const invoiceDetailsDiv = document.getElementById('invoice-details');
    const orderDateElement = document.getElementById('order-date');
    const transactionIdElement = document.getElementById('transaction-id');

    if (!invoiceDetailsDiv || !orderDateElement || !transactionIdElement) return;

    if (cart.length === 0) {
        alert('No items found in the cart.');
        return;
    }

    // Generate current date
    const orderDate = new Date().toLocaleDateString();
    orderDateElement.textContent = orderDate;

    //generate random transaction ID
    const transactionId = 'TXN' + Math.floor(Math.random() * 1000000);
    transactionIdElement.textContent = transactionId;

    let subtotal = 0;
    cart.forEach(item => {
        const itemElement = document.createElement('p');
        itemElement.textContent = `${item.productName}: $${item.price}`;
        invoiceDetailsDiv.appendChild(itemElement);
        subtotal += item.price;
    });

    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    const summary = document.createElement('p');
    summary.innerHTML = `
        <strong>Subtotal:</strong> $${subtotal.toFixed(2)}<br>
        <strong>Tax (15%):</strong> $${tax.toFixed(2)}<br>
        <strong>Total:</strong> $${total.toFixed(2)}
    `;
    invoiceDetailsDiv.appendChild(summary);
}

// Download the invoice
function downloadInvoice() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]'); // Retrieve cart data
    if (cart.length === 0) {
        alert('No items found in the cart.');
        return;
    }

    // Generate order details
    const orderDate = new Date().toLocaleDateString();
    const transactionId = 'TXN' + Math.floor(Math.random() * 1000000);

    // Prepare invoice content
    let invoiceContent = `Preset Society Invoice\n\n`;
    invoiceContent += `Order Date: ${orderDate}\nTransaction ID: ${transactionId}\n\n`;
    invoiceContent += `--------------------------------------------\n`;

    let subtotal = 0;
    cart.forEach(item => {
        invoiceContent += `${item.productName}: $${item.price.toFixed(2)}\n`;
        subtotal += item.price;
    });

    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal + tax;

    invoiceContent += `--------------------------------------------\n`;
    invoiceContent += `Subtotal: $${subtotal.toFixed(2)}\n`;
    invoiceContent += `Tax (15%): $${tax.toFixed(2)}\n`;
    invoiceContent += `Total: $${total.toFixed(2)}\n`;
    invoiceContent += `--------------------------------------------\n`;
    invoiceContent += `Thank you for shopping with Preset Society!\n`;

    // Create a blob and download link
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_${transactionId}.txt`; // File name for download
    link.click(); // startthe download
}

// Updates on the cart page
if (document.getElementById('cart-items')) {
    updateCart();
}

//invoice generates on the invoice page
if (window.location.pathname.includes('invoice.html')) {
    generateInvoice();
}

// Retrieve stored users from localStorage or initialize an empty array
let users = JSON.parse(localStorage.getItem('users')) || [];

// limit on number of attempts to login
let loginAttempts = 0;
const maxAttempts = 3;

// login form submission
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Check if the username and password match any stored user
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            alert('Login successful! Redirecting to the homepage...');
            window.location.href = "index.html";
        } else {
            loginAttempts++;
            if (loginAttempts >= maxAttempts) {
                alert('Maximum login attempts reached. Redirecting to the error page...');
                window.location.href = "error.html";
            } else {
                document.getElementById('login-message').textContent =
                    `Invalid credentials. You have ${maxAttempts - loginAttempts} attempt(s) left.`;
            }
        }
    });
}
