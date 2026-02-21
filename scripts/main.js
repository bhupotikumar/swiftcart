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
                        <button class="btn btn-outline btn-primary"><i
                                class="fa-solid fa-cart-arrow-down"></i>Add</button>
                    </div>
                </div>
            </div>`;
        productElement.querySelector('.details-btn').addEventListener('click', () => {
            showProductDetails(product);
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
                    <button class="btn btn-outline btn-primary"><i
                    class="fa-solid fa-cart-arrow-down"></i>Add</button>
                </div>
            </div >
        </div >
    `;
    modal.showModal();
};