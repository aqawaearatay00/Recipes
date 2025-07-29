const TOKEN = "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"; // Replace with your actual token

async function getRecipePages(retries = 3) {
    const timestamp = Date.now(); // Bust cache
    const url = `https://api.github.com/repos/aqawaearatay00/Recipes/contents/recipes?nocache=${timestamp}`;
    const headers = {
        "Authorization": `Bearer ${TOKEN}`,
        "Accept": "application/vnd.github.v3+json"
    };

    try {
        const response = await fetch(url, { headers });

        if (response.status === 403 && response.headers.get("X-RateLimit-Remaining") === "0") {
            const reset = parseInt(response.headers.get("X-RateLimit-Reset")) * 1000;
            const delay = reset - Date.now();
            console.warn(`Rate limit hit. Pausing for ${Math.ceil(delay / 1000)}s…`);
            await new Promise(r => setTimeout(r, delay));
            return getRecipePages(retries);
        }

        if (!response.ok) throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);

        const files = await response.json();
        return files
            .filter(f => f.name.endsWith(".html"))
            .map(f => ({
                title: f.name.replace(".html", "").replace(/[-_]/g, " "),
                url: "recipes/" + f.name
            }))
            .sort((a, b) => a.title.localeCompare(b.title));
    } catch (err) {
        if (retries > 0) {
            console.warn(`Retrying due to error: ${err.message}`);
            await new Promise(r => setTimeout(r, 1000));
            return getRecipePages(retries - 1);
        }
        throw err;
    }
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

getRecipePages().then(pages => {
    const searchBox = document.getElementById("searchBox");
    const results = document.getElementById("results");
    const listAll = document.getElementById("listAll");

    listAll.innerHTML = pages.map(p =>
        `<li><a href="${p.url}" class="fullListLink">${capitalizeWords(p.title)}</a></li>`
    ).join("");

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

