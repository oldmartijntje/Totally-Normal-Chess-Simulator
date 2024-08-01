function goTo(path) {
    window.location.href = path;
}

const products = [
    { name: '20 Credits', price: 3.25, amountCredits: 20 },
    { name: '100 Credits', price: 10, amountCredits: 100 },
    { name: '500 Credits', price: 45, amountCredits: 500 },
    { name: '1000 Credits', price: 80, amountCredits: 1000 },
    { name: '2000 Credits', price: 150, amountCredits: 2000 },
];

let tempTokens = localStorage.getItem('tokens');
let cart = {};
let total = 0;

if (localStorage.getItem('mail')) {
    document.querySelector('input[type="email"]').value = localStorage.getItem('mail');
}

function addToCart(item, price) {
    if (cart[item]) {
        cart[item].quantity++;
    } else {
        cart[item] = { price, quantity: 1 };
    }
    total += price;
    updateCart();
}

function removeFromCart(item) {
    if (cart[item]) {
        total -= cart[item].price;
        cart[item].quantity--;
        if (cart[item].quantity === 0) {
            delete cart[item];
        }
        updateCart();
    }
}

function updateCart() {
    const checkoutButton = document.getElementById('checkoutButton');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const mailError = document.getElementById('mailError');
    const balanceCurrent = document.getElementById('balance-current');
    const balanceNext = document.getElementById('balance-next');
    const nameError = document.getElementById('nameError');
    amountOfShopping = 0;
    cartItems.innerHTML = '';
    Object.entries(cart).forEach(([item, details]) => {
        let amount = parseInt(item.split(' ')[0]) * details.quantity;
        amountOfShopping += amount;

        const li = document.createElement('li');
        li.className = 'flex justify-between items-center';
        li.innerHTML = `
            <span>${details.quantity}x ${item} - $${(details.price * details.quantity).toFixed(2)}</span>
            <button onclick="removeFromCart('${item}')" class="btn btn-secondary py-1 px-2 text-sm">Remove</button>
        `;
        cartItems.appendChild(li);
    });
    balanceCurrent.textContent = localStorage.getItem('tokens');
    balanceNext.textContent = (parseInt(localStorage.getItem('tokens')) + amountOfShopping);
    tempTokens = amountOfShopping;


    cartSubtotal.textContent = total.toFixed(2);
    cartTotal.textContent = total.toFixed(2);
    let mail = document.querySelector('input[type="email"]').value;
    let fullname = [document.querySelector('input[placeholder="First name"]').value, document.querySelector('input[placeholder="Last name"]').value];
    let error = false;
    if (!mail || !mail.includes('@') || !mail.includes('.') || mail.length < 5) {
        error = true;
        if (total !== 0) {
            mailError.style.display = 'block';
        } else {
            mailError.style.display = 'none';
        }
    } else {
        mailError.style.display = 'none';
    }

    if (fullname[0].length < 2 || fullname[1].length < 2) {
        error = true;
        if (total !== 0) {
            nameError.style.display = 'block';
        } else {
            nameError.style.display = 'none';
        }
    } else {
        nameError.style.display = 'none';
    }
    if (error || total === 0) {
        checkoutButton.disabled = true;
    } else {
        checkoutButton.disabled = false;
    }
}

function checkout() {
    localStorage.setItem('lastCheckout', JSON.stringify({
        cart,
        totalCost: total,
        amountOfShopping,
        fullName: [document.querySelector('input[placeholder="First name"]').value, document.querySelector('input[placeholder="Last name"]').value],
        balanceBefore: parseInt(localStorage.getItem('tokens')),
    }));
    localStorage.setItem('tokens', (parseInt(localStorage.getItem('tokens')) + amountOfShopping));
    localStorage.setItem('mail', document.querySelector('input[type="email"]').value);
    alert('Thank you for your purchase!');
    cart = {};
    total = 0;
    updateCart();
    if (!isMobile()) {
        // Redirect to receipt page, on a new page _blank
        window.open('./receipt', '_blank');
    }
    window.location.href = '../';
}

function isMobile() {
    return window.innerWidth < 768;
}

function initializeProductList() {
    const productList = document.getElementById('product-list');
    products.forEach(product => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center';
        li.innerHTML = `
            <span>${product.name} - $${product.price}</span>
            <button onclick="addToCart('${product.name}', ${product.price})" class="btn btn-primary py-1 px-2 text-sm">
                Add to Cart
            </button>
        `;
        productList.appendChild(li);
    });
}

function initializeRandomCart() {
    products.forEach(product => {
        const quantity = Math.floor(Math.random() * 3); // 0 to 2 items
        for (let i = 0; i < quantity; i++) {
            addToCart(product.name, product.price);
        }
    });
}

const localsotrageBalance = localStorage.getItem('tokens');
// Initialize the page
initializeProductList();
updateCart();
// initializeRandomCart();