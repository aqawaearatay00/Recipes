async function getRecipePages() {
    const timestamp = Date.now(); // Bust cache
    const url = `https://api.github.com/repos/aqawaearatay00/Recipes/contents/recipes?nocache=${timestamp}`;

    const response = await fetch(url); // No headers to avoid CORS
    if (!response.ok) {
        throw new Error(`Failed to fetch recipe list: ${response.status} ${response.statusText}`);
    }

    const files = await response.json();

    return files
        .filter(f => f.name.endsWith(".html"))
        .map(f => ({
            title: f.name.replace(".html", "").replace(/[-_]/g, " "),
            url: "recipes/" + f.name
        }))
        .sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

getRecipePages().then(pages => {
    const searchBox = document.getElementById("searchBox");
    const results = document.getElementById("results");
    const listAll = document.getElementById("listAll"); // 📌 Add this container under your search in HTML

    // Render full A-Z list on load
    listAll.innerHTML = pages.map(p =>
        `<li><a href="${p.url}" class="fullListLink">${capitalizeWords(p.title)}</a></li>`
    ).join("");

    // Wire up search
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
