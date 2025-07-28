async function getRecipePages() {
    const response = await fetch("https://api.github.com/repos/aqawaearatay00/Recipes/contents/recipes");
    const files = await response.json();

    return files
        .filter(file => file.name.endsWith(".html"))
        .map(file => ({
            title: file.name.replace(".html", "").replace(/-/g, " "),
            url: "recipes/" + file.name
        }));
}

getRecipePages().then(pages => {
    document.getElementById("searchBox").addEventListener("input", function () {
        const query = this.value.toLowerCase();

        // Clear results when input is empty
        if (query.length === 0) {
            document.getElementById("results").innerHTML = "";
            return;
        }

        // Filter and render matching results
        const matches = pages.filter(p => p.title.toLowerCase().startsWith(query));
        document.getElementById("results").innerHTML = matches.map(p =>
            `<li><a href="${p.url}" class="resultLink">${p.title}</a></li>`
        ).join("");
    });
});