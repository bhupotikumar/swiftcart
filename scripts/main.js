// Function to load external HTML into a div
const loadHTML = (id, url) => {
    fetch(url)
        .then(res => res.text())
        .then(html => {
            document.getElementById(id).innerHTML = html;
        })
        .catch(err => console.error(`Error loading ${url}:`, err));
};

// Load header and footer
loadHTML("header", "../components/header.html");
loadHTML("footer", "../components/footer.html");

// Function to load categories from API and display them
const loadCategories = () => {
    fetch('https://fakestoreapi.com/products/categories')
        .then(res => res.json())
        .then(categories => displayCategories(categories))
}
const displayCategories = (categories) => {
    const categoriesContainer = document.getElementById('categories');
    categories.forEach(category => {
        const button = document.createElement('button');

        button.textContent = category;
        button.className = "btn btn-outline btn-primary capitalize text-gray-600 font-semibold rounded-full hover:text-white";

        button.addEventListener('click', () => {
            loadProductsByCategory(category);
        });

        categoriesContainer.appendChild(button);
    });
};
loadCategories();

// Function to load products from API and display them
const loadProducts = () => {
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(products => displayProducts(products))
}
const loadProductsByCategory = (category) => {
    fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`)
        .then(res => res.json())
        .then(data => displayProducts(data));
};
const displayProducts = (products) => {
    const productsContainer = document.getElementById('products-container');
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
                        <div class="badge text-blue-900 bg-blue-100 truncate">${product.category}</div>
                        <div class="flex items-center gap-2"><i class="fa-solid fa-star text-yellow-500"></i><span>${product.rating.rate} (${product.rating.count})</span></div>
                    </div>
                    <h2 class="text-xl font-semibold truncate">
                        ${product.title}
                    </h2>
                    <p class="text-xl font-bold">$${product.price}</p>
                    <div class="card-actions justify-between">
                        <button class="btn btn-outline btn-primary"><i class="fa-regular fa-eye"></i>Details</button>
                        <button class="btn btn-outline btn-primary"><i
                                class="fa-solid fa-cart-arrow-down"></i>Add</button>
                    </div>
                </div>
            </div>`;
        productsContainer.appendChild(productElement);
    });
}
loadProducts();