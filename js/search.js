const searchInput = document.getElementById("search-bar");
const resultsDiv = document.getElementById("main-box");


let currentPage = 1;
let searchQuery = "";

const apiKey = "fb886a74";

const fetchMovies = async (page = 1) => {
    const query = searchInput.value.trim();
    if (query === searchQuery && page === 1) return;  

    searchQuery = query;
    currentPage = page;

    if (page === 1) {
        resultsDiv.innerHTML = "";
    }

    if (query.length > 0) {
        const url =`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.Response === "True") {
                displayResults(data.Search);
                loadMoreButton.style.display = "block";
            } else {
                resultsDiv.innerHTML = "<p>Aucun film trouvé</p>";
                loadMoreButton.style.display = "none";
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des films:", error);
        }
    } else {
        resultsDiv.innerHTML = "";
        loadMoreButton.style.display = "none"; 
    }
};

const displayResults = (movies) => {
    movies.forEach(movie => {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("box");
        movieDiv.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>Année: ${movie.Year}</p>
                <p>Note: ${movie.imdbRating}/10</p>
                <p>Genre: ${movie.Genre}</p>
                <button class="more">Détails</button>
            </div>
        `;
        resultsDiv.appendChild(movieDiv);
    });
};

const loadMoreResults = () => {
    fetchMovies(currentPage + 1); 
};
searchInput.addEventListener("input", () => fetchMovies(1)); 

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('more')) {
        const movieInfo = event.target.closest('.movie-info');
        const title = movieInfo.querySelector('h3').textContent;
        window.location.href = `movie.html?title=${title}`;
    }    
});
