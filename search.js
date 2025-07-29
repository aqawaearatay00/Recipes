async function getRecipePages() {
    const timestamp = Date.now(); // 🔥 Unique query string for cache-busting
    const url = `https://api.github.com/repos/aqawaearatay00/Recipes/contents/recipes?nocache=${timestamp}`;

    const response = await fetch(url); // ⚠️ No custom headers to avoid CORS rejection

    if (!response.ok) {
        throw new Error(`Failed to fetch recipe list: ${response.status} ${response.statusText}`);
    }

    const files = await response.json();

    return files
        .filter(f => f.name.endsWith(".html"))
        .map(f => ({
            title: f.name.replace(".html", "").replace(/[-_]/g, " "),
            url: "recipes/" + f.name
        }));
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

getRecipePages().then(pages => {
    const searchBox = document.getElementById("searchBox");
    const results = document.getElementById("results");

    searchBox.addEventListener("input", () => {
        const queryRaw = searchBox.value;
        const query = queryRaw.trim().toLowerCase();

        results.innerHTML = "";
        if (query.length === 0) return;

        const matches = pages.filter(p => {
            const words = p.title.toLowerCase().split(/[\s\-_.,]+/);
            return words.some(word => word.startsWith(query));
        });

        searchBox.value = capitalizeWords(queryRaw);

        results.innerHTML = matches.map(p =>
            `<li><a href="${p.url}" class="resultLink">${capitalizeWords(p.title)}</a></li>`
        ).join("");
    });
}).catch(err => {
    console.error("Search setup failed:", err.message);
});

