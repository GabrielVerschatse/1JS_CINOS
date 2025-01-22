const searchInput = document.getElementById("search-bar");
const resultsDiv = document.getElementById("main-box");
const loadMoreButton = document.getElementById("loadMore");

let currentPage = 1;
let searchQuery = "";
let allMovies = [];
let displayedCount = 0;
const moviesPerPage = 4;

const apiKey = "fb886a74";

const fetchMovies = async (page = 1) => {
    const query = searchInput.value.trim();
    if (query === searchQuery && page === 1) return;

    searchQuery = query;
    currentPage = page;

    if (page === 1) {
        resultsDiv.innerHTML = "";
        allMovies = [];
        displayedCount = 0;
    }

    if (query.length > 0) {
        const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.Response === "True") {
                allMovies = data.Search;
                displayMoreResults();
            } else {
                resultsDiv.innerHTML = "<p>Aucun film trouvé</p>";
                loadMoreButton.style.display = "none";
            }
        } catch (error) {
            console.error("Erreur lors de l'affichage des films':", error);
        }
    } else {
        resultsDiv.innerHTML = "";
        loadMoreButton.style.display = "none";
    }
};

const displayMoreResults = () => {
    const remainingMovies = allMovies.slice(displayedCount, displayedCount + moviesPerPage);

    remainingMovies.forEach(movie => {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("box");
        movieDiv.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>Année: ${movie.Year}</p>
                <p>Note: ${movie.imdbRating}/10</p>
                <p>Genre: ${movie.Genre}</p>
                <button class="more">En savoir plus</button>
            </div>
        `;
        resultsDiv.appendChild(movieDiv);
    });

    displayedCount += moviesPerPage;

    loadMoreButton.style.display = displayedCount < allMovies.length ? "block" : "none";
};


searchInput.addEventListener("input", () => fetchMovies(1));
loadMoreButton.addEventListener("click", displayMoreResults);

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('more')) {
        const movieInfo = event.target.closest('.movie-info');
        const title = movieInfo.querySelector('h3').textContent;
        window.location.href = `movie.html?title=${title}`;
    }
});

document.addEventListener('click', (event) => {
    const searchButton = document.querySelector('.nav-btn:nth-child(2)');
    if (event.target === searchButton) {
        window.location.href = 'search.html';
    }
});

document.addEventListener('click', (event) => {
    const homeButton = document.querySelector('.nav-btn:nth-child(1)');
    if (event.target === homeButton) {
        window.location.href = 'index.html';
    }
});