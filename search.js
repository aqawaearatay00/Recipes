const token = "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";
const searchInputId = "searchBox";
const resultsListId = "results";
const fullListId = "listAll";

// Format title from filename
function formatTitle(filename) {
    return filename
        .replace(".html", "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
}

// Styled box for search results
function createStyledItem(title, url) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = url;
    a.textContent = title;
    li.appendChild(a);

    li.style.backgroundColor = "#c0c0c0ff";
    li.style.padding = "0.5rem 0.75rem";
    li.style.marginBottom = "0.5rem";
    li.style.borderRadius = "6px";

    li.addEventListener("mouseenter", () => {
        li.style.backgroundColor = "c0c0c0ff";
    });
    li.addEventListener("mouseleave", () => {
        li.style.backgroundColor = "c0c0c0ff";
    });

    return li;
}

// Unstyled item for full list
function createPlainItem(title, url) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = url;
    a.textContent = title;
    li.appendChild(a);
    return li;
}

async function getRecipePages() {
    const timestamp = Date.now();
    const url = `https://api.github.com/repos/aqawaearatay00/Recipes/contents/recipes?nocache=${timestamp}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json"
        }
    });

    if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
    }

    const files = await response.json();

    return files
        .filter(f => f.name.endsWith(".html"))
        .map(f => ({
            title: formatTitle(f.name),
            url: `recipes/${f.name}`
        }))
        .sort((a, b) => a.title.localeCompare(b.title));
}

async function runSearch() {
    const input = document.getElementById(searchInputId);
    const resultsList = document.getElementById(resultsListId);
    const fullList = document.getElementById(fullListId);
    const pages = await getRecipePages();

    // Show plain full list once
    fullList.innerHTML = "";
    for (const page of pages) {
        fullList.appendChild(createPlainItem(page.title, page.url));
    }

    // Search input listener
    input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();
        resultsList.innerHTML = "";

        if (query === "") return;

        const matches = pages.filter(p =>
            p.title.toLowerCase().split(/\s+/).some(word => word.startsWith(query))
        );

        for (const match of matches) {
            resultsList.appendChild(createStyledItem(match.title, match.url));
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    runSearch().catch(err => {
        const resultsList = document.getElementById(resultsListId);
        resultsList.innerHTML = `<li style="color: red;">Error: ${err.message}</li>`;
    });
});
