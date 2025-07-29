async function getRecipePages() {
    const response = await fetch("https://api.github.com/repos/aqawaearatay00/Recipes/contents/recipes");
    const files = await response.json();

    return files
        .filter(file => file.name.endsWith(".html"))
        .map(file => ({
            title: file.name
                .replace(".html", "")
                .replace(/[-_]/g, " "), // normalize for search
            url: "recipes/" + file.name
        }));
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

getRecipePages().then(pages => {
    document.getElementById("searchBox").addEventListener("input", function () {
        const queryRaw = this.value;
        const query = queryRaw.toLowerCase();

        if (query.length === 0) {
            document.getElementById("results").innerHTML = "";
            return;
        }

        // Search titles with forgiving lowercase match
        const matches = pages.filter(p =>
            p.title.toLowerCase().includes(query)
        );

        // Capitalize input display
        this.value = capitalizeWords(queryRaw);

        // Capitalize result titles
        document.getElementById("results").innerHTML = matches.map(p =>
            `<li><a href="${p.url}" class="resultLink">${capitalizeWords(p.title)}</a></li>`
        ).join("");
    });
});