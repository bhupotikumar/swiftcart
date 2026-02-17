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
