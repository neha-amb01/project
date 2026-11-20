
// VIPHA PHARMA - JAVASCRIPT

// 1. PRODUCT DATABASE

const products = [
    {
        id: 1,
        name: "Vitamin C Tablets",
        category: "tablets",
        price: 120,
        description: "Sample vitamin supplement product.",
        image: "images/medical-products-some-close-up-38337039.webp"
    },
    {
        id: 2,
        name: "Calcium Tablets",
        category: "tablets",
        price: 150,
        description: "Sample calcium supplement product.",
        image: "images/lot-pharmaceutical-products-9966528.webp"
    },
    {
        id: 3,
        name: "Health Capsules",
        category: "capsules",
        price: 180,
        description: "Sample wellness capsule product.",
        image: "images/medical-product-mockups-display-medical-healthcare-product-designs_839035-310898.avif"
    },
    {
        id: 4,
        name: "Multivitamin Capsules",
        category: "capsules",
        price: 220,
        description: "Sample multivitamin product.",
        image: "images/medical-products-some-close-up-38337039.webp"
    },
    {
        id: 5,
        name: "Healthcare Kit",
        category: "healthcare",
        price: 350,
        description: "Sample healthcare essentials kit.",
        image: "images/OIP%20(2).webp"
    },
    {
        id: 6,
        name: "First Aid Kit",
        category: "healthcare",
        price: 250,
        description: "Basic first-aid essentials.",
        image: "images/set-medical-supplies-cosmetic-healthcare-products-creative-abstract-medicine-pharmacy-industry-business-concept-group-55904969.webp"
    },
    {
        id: 7,
        name: "Vitamin Wellness Pack",
        category: "wellness",
        price: 280,
        description: "Sample wellness product pack.",
        image: "images/medical-product-mockups-display-medical-healthcare-product-designs_839035-310898.avif"
    },
    {
        id: 8,
        name: "Health Supplement",
        category: "wellness",
        price: 200,
        description: "Sample nutritional supplement.",
        image: "images/lot-pharmaceutical-products-9966528.webp"
    }
];


// 2. DISPLAY PRODUCTS

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const noResults = document.getElementById("noResults");

let cart = [];

function displayProducts(items) {

    productGrid.innerHTML = "";

    if (items.length === 0) {
        noResults.style.display = "block";
        return;
    }

    noResults.style.display = "none";

    items.forEach(product => {

        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <span class="product-category">
                    ${product.category.toUpperCase()}
                </span>

                <img src="${product.image}"
                     alt="${product.name}"
                     loading="lazy"
                     onerror="this.onerror=null;this.src='https://placehold.co/400x300/e7f6f2/087f72?text=Vipha+Pharma'">
            </div>

            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>

                <div class="product-bottom">
                    <span class="product-price">
                        ₹${product.price}
                    </span>

                    <button class="add-cart"
                        onclick="addToCart(${product.id})">
                        <i class="fa-solid fa-cart-plus"></i>
                        Add
                    </button>
                </div>
            </div>
        `;

        productGrid.appendChild(card);

    });
}


// 3. SEARCH PRODUCTS

function filterProducts() {

    const searchValue = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredProducts = products.filter(product => {

        const matchesName = product.name
            .toLowerCase()
            .includes(searchValue);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesName && matchesCategory;

    });

    displayProducts(filteredProducts);
}

searchInput.addEventListener("input", filterProducts);

categoryFilter.addEventListener("change", filterProducts);


// 4. ADD PRODUCTS TO CART

function addToCart(productOrName, price) {

    const product = typeof productOrName === "number"
        ? products.find(item => item.id === productOrName)
        : {
            id: productOrName,
            name: productOrName,
            price: Number(price)
        };

    if (!product || !Number.isFinite(product.price)) return;

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}


// 5. UPDATE CART

function updateCart() {

    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const navCartCount = document.getElementById("navCartCount");

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                <i class="fa-solid fa-cart-shopping"></i>
                Your cart is currently empty.
            </p>
        `;

    }

    let total = 0;
    let count = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;
        count += item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>₹${item.price} × ${item.quantity}</p>
            </div>

            <div class="cart-actions">

                <button type="button" data-quantity-change="-1"
                    aria-label="Decrease quantity">−</button>

                <strong>${item.quantity}</strong>

                <button type="button" data-quantity-change="1"
                    aria-label="Increase quantity">+</button>

                <button type="button" class="remove-btn" data-remove-item
                    aria-label="Remove product">
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>
        `;

        div.querySelectorAll("[data-quantity-change]").forEach(button => {
            button.addEventListener("click", () => {
                changeQuantity(item.id, Number(button.dataset.quantityChange));
            });
        });
        div.querySelector("[data-remove-item]").addEventListener("click", () => {
            removeFromCart(item.id);
        });

        cartItems.appendChild(div);

    });

    cartCount.textContent = count;
    cartTotal.textContent = "₹" + total.toFixed(2);
    navCartCount.textContent = count;
    document.querySelector(".cart-link").setAttribute(
        "aria-label",
        `Shopping cart, ${count} ${count === 1 ? "item" : "items"}`
    );

}


// 6. CHANGE QUANTITY

function changeQuantity(productId, change) {

    const item = cart.find(p => p.id === productId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    updateCart();
}


// 7. REMOVE PRODUCT

function removeFromCart(productId) {

    cart = cart.filter(item => item.id !== productId);

    updateCart();

}


// 8. REVIEW CART

document.getElementById("checkoutBtn").addEventListener("click", function() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert(
        "You have selected " +
        cart.reduce((sum, item) => sum + item.quantity, 0) +
        " item(s).\n\nThis is a demonstration website. No order or payment will be processed."
    );

});


// 9. MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", function() {

    navLinks.classList.toggle("active");

    const icon = menuToggle.querySelector("i");

    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");

});


// CLOSE MOBILE MENU AFTER CLICK

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", function() {

        navLinks.classList.remove("active");

        const icon = menuToggle.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


// 10. CONTACT FORM

document.getElementById("contactForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();

    document.getElementById("formMessage").textContent =
        "Thank you, " + name + "! Your demo message has been received.";

    this.reset();

});


// 11. NEWSLETTER FORM

document.getElementById("newsletterForm").addEventListener("submit", function(event) {

    event.preventDefault();

    alert("Thank you for subscribing to Vipha Pharma!");

    this.reset();

});


// 12. INITIALIZE WEBSITE

displayProducts(products);
updateCart();
