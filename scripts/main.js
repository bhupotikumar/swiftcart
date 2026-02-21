// Function to load external HTML into a div
const loadHTML = (id, url) => {
    return fetch(url)
        .then(res => res.text())
        .then(html => {
            document.getElementById(id).innerHTML = html;
        })
        .catch(err => console.error(`Error loading ${url}:`, err));
};

// Load header and footer
loadHTML("header", "../components/header.html").then(() => {
    setActiveNav();
    displayCartItems();
});
loadHTML("footer", "../components/footer.html");

// Function to highlight active nav link
const setActiveNav = () => {
    const currentPath = window.location.pathname.split('/').pop(); // e.g. "products.html"
    const navLinks = document.querySelectorAll('.navbar a[href]');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();

        if (linkPath === currentPath || (linkPath === 'index.html' && currentPath === '')) {
            link.classList.add('text-indigo-600', 'font-bold'); // active style
        } else {
            link.classList.remove('text-indigo-600', 'font-bold');
        }
    });
};



// Function to load categories from API and display them
const loadCategories = () => {
    const loader = document.querySelector('.loading');
    const categoriesContainer = document.getElementById('categories');
    if (!loader || !categoriesContainer) return;
    loader.classList.remove('hidden');
    categoriesContainer.classList.add('hidden');
    fetch('https://fakestoreapi.com/products/categories')
        .then(res => res.json())
        .then(categories => {
            displayCategories(categories)
            loader.classList.add('hidden');
            categoriesContainer.classList.remove('hidden');
        })
        .catch(err => {
            console.error('Error loading categories:', err);
            loader.classList.add('hidden');
            categoriesContainer.classList.remove('hidden');
        });
};
const displayCategories = (categories) => {
    const categoriesContainer = document.getElementById('categories');
    if (!categoriesContainer) return;
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.className = "category-btn btn btn-outline capitalize font-semibold rounded-full";

        button.dataset.category = category;
        button.addEventListener('click', () => {
            loadProductsByCategory(category);
        });

        categoriesContainer.appendChild(button);
    });
};
loadCategories();

// Function to load products by category and display them
const loadProductsByCategory = (category) => {
    const loader = document.querySelector('.loading');
    const productsContainer = document.getElementById('products-container');
    const categoryBtns = document.querySelectorAll('.category-btn');
    if (!loader || !productsContainer) return;
    loader.classList.remove('hidden');
    productsContainer.classList.add('hidden');


    categoryBtns.forEach(btn => btn.classList.remove('btn-primary'));
    categoryBtns.forEach(btn => btn.classList.add('btn-outline'));

    const button = Array.from(categoryBtns).find(btn => btn.dataset.category === category);
    if (button) {
        button.classList.add('btn-primary');
        button.classList.remove('btn-outline');
    }

    let url = category === 'all'
        ? 'https://fakestoreapi.com/products'
        : `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            displayProducts(data);
            loader.classList.add('hidden');
            productsContainer.classList.remove('hidden');
        })
        .catch(err => {
            console.error(`Error loading products for category ${category}:`, err);
            loader.classList.add('hidden');
            productsContainer.classList.remove('hidden');
        });
};
const displayProducts = (products) => {
    const productsContainer = document.getElementById('products-container');
    const cartContainer = document.getElementById('cart-container');
    if (!productsContainer) return;
    productsContainer.innerHTML = '';

    products.map(product => {
        const productElement = document.createElement('div');
        productElement.innerHTML = `
            <div class="card bg-base-100 w-full shadow-lg">
                <figure class="h-64 w-full p-4 bg-gray-300">
                    <img class="h-full w-full object-contain" src="${product.image}" alt="${product.title}" />
                </figure>
                <div class="card-body p-2">
                    <div class="flex justify-between my-4">
                        <div class="badge text-indigo-600 bg-indigo-100 truncate">${product.category}</div>
                        <div class="flex items-center gap-2"><i class="fa-solid fa-star text-yellow-500"></i><span>${product.rating.rate} (${product.rating.count})</span></div>
                    </div>
                    <h2 class="text-xl font-semibold truncate">
                        ${product.title}
                    </h2>
                    <p class="text-xl font-bold">$${product.price}</p>
                    <div class="card-actions justify-between">
                        <button 
                        class="details-btn btn btn-outline btn-primary"
                        ><i class="fa-regular fa-eye"></i>Details</button>
                        <button class="add-btn btn btn-outline btn-primary"><i
                                class="fa-solid fa-cart-arrow-down"></i>Add</button>
                    </div>
                </div>
            </div>`;
        productElement.querySelector('.details-btn').addEventListener('click', () => {
            showProductDetails(product);
        });
        productElement.querySelector('.add-btn').addEventListener('click', () => {
            addToCart(product);
        });
        productsContainer.appendChild(productElement);
    });
}
loadProductsByCategory('all');

const loadTrendingProducts = () => {
    fetch('https://fakestoreapi.com/products?limit=4')
        .then(res => res.json())
        .then(data => displayTrendingProducts(data));
}
const displayTrendingProducts = (products) => {
    const trendingContainer = document.getElementById('trending-container');
    if (!trendingContainer) return;
    const skeleton = document.getElementById('card-skeleton');
    if (skeleton) skeleton.classList.add('hidden');
    const topProducts = [...products].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 4);

    topProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.innerHTML = `
            <div class="card bg-base-100 w-full shadow-lg">
                <figure class="h-64 w-full p-4 bg-gray-300">
                    <img class="h-full w-full object-contain" src="${product.image}" alt="${product.title}" />
                </figure>
                <div class="card-body p-2">
                    <div class="flex justify-between my-4">
                        <div class="badge text-indigo-600 bg-indigo-100 truncate">${product.category}</div>
                        <div class="flex items-center gap-2"><i class="fa-solid fa-star text-yellow-500"></i><span>${product.rating.rate} (${product.rating.count})</span></div>
                    </div>
                    <h2 class="text-xl font-semibold truncate">
                        ${product.title}
                    </h2>
                    <p class="text-xl font-bold">$${product.price}</p>
                    <div class="card-actions justify-between">
                        <button 
                        class="details-btn btn btn-outline btn-primary"><i class="fa-regular fa-eye"></i>Details</button>
                        <button class="btn btn-outline btn-primary"><i
                                class="fa-solid fa-cart-arrow-down"></i>Add</button>
                    </div>
                </div>
            </div>`;
        productElement.querySelector('.details-btn').addEventListener('click', () => {
            showProductDetails(product);
        });
        trendingContainer.appendChild(productElement);
    });
}
loadTrendingProducts();


// Modal functionality
const showProductDetails = (product) => {
    const modal = document.getElementById('my_modal_3');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <div class="card bg-base-100 w-full shadow-lg">
            <figure class="h-64 w-full p-4 bg-gray-300">
                <img class="h-full w-full object-contain" src="${product.image}" alt="${product.title}" />
            </figure>
            <div class="card-body p-2">
                <div class="flex justify-between my-4">
                    <div class="badge text-indigo-600 bg-indigo-100">${product.category}</div>
                    <div class="flex items-center gap-2"><i class="fa-solid fa-star text-yellow-500"></i><span>${product.rating.rate} (${product.rating.count})</span></div>
                </div>
                <h2 class="text-xl font-semibold">
                    ${product.title}
                </h2>
                <p class="text-xl font-bold">$${product.price}</p>
                <div class="card-actions justify-between">
                    <button
                    class="details-btn btn btn-outline btn-primary">Buy Now</button>
                    <button class="add-btn btn btn-outline btn-primary"><i
                    class="fa-solid fa-cart-arrow-down"></i>Add</button>
                </div>
            </div >
        </div >
    `;
    modalContent.querySelector('.add-btn').addEventListener('click', () => {
        addToCart(product);
    });
    modal.showModal();
};

// Add to cart functionality
const addToCart = (product) => {
    const cartContainer = document.getElementById('cart-container');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.title} added to cart!`);
    displayCartItems();
}

const displayCartItems = () => {
    const cartContainer = document.getElementById('cart-container');
    const cartCount = document.getElementById('cart-count');
    if (!cartContainer || !cartCount) return;

    cartContainer.innerHTML = '';

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(product => {
        totalItems += product.quantity;
        totalPrice += product.price * product.quantity;

        const cartItem = document.createElement('div');
        cartItem.innerHTML = `
            <div class="flex items-center gap-4 p-2 border-b">
                <img class="h-16 w-16 object-contain" src="${product.image}" />
                <div>
                    <h3 class="font-semibold">${product.title}</h3>
                    <p class="text-sm">$${product.price} x ${product.quantity}</p>
                </div>
                <button type="button" class="ml-auto hover:text-red-700 remove-btn" data-id="${product.id}"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    if (cart.length > 0) {
        const cartCalc = document.createElement('div');
        cartCalc.innerHTML = `
            <div class="p-2 border-t mt-2">
                <p class="text-sm font-semibold">Total: $${totalPrice.toFixed(2)}</p>
                <button class="btn btn-primary w-full mt-2">Checkout</button>
            </div>
        `;
        cartContainer.appendChild(cartCalc);
    }
    else {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = "empty-cart text-sm text-gray-400 text-center";
        emptyMessage.textContent = "Your cart is empty.";
        cartContainer.appendChild(emptyMessage);
    }

    cartCount.textContent = totalItems;
    // Remove button event
    cartContainer.addEventListener("click", (e) => {
        const removeBtn = e.target.closest(".remove-btn");
        if (!removeBtn) return;

        const id = Number(removeBtn.dataset.id);

        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        cart = cart.filter(item => item.id !== id);

        localStorage.setItem('cart', JSON.stringify(cart));

        displayCartItems();
    });
}
