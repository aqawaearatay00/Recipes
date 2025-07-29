// Search input handler
document.getElementById('searchInput').addEventListener('input', function () {
    const query = this.value.trim().toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results

    // Skip overly short queries to reduce noise
    if (query.length < 2) return;

    // Recipe dataset (can be filenames, titles, etc.)
    const recipes = [
        'Chocolate Chip Cookies',
        'Triple Chocolate Biscotti',
        'Cheddar Biscuits',
        'Caramel Apple Pie',
        'Chili Lime Tacos'
        // Add your actual list here
    ];

    // Tokenize and filter by prefix
    const matches = recipes.filter(recipe => {
        return recipe
            .toLowerCase()
            .split(/[\s\-_,]+/) // split into words
            .some(word => word.startsWith(query));
    });

    // Display filtered results
    matches.forEach(match => {
        const div = document.createElement('div');
        div.textContent = match;
        resultsContainer.appendChild(div);
    });
});
