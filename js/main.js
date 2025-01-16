// Constantes
const OMDB_API_KEY = 'fb886a74';
const BASE_URL = 'https://www.omdbapi.com/';
const filmsContainer = document.querySelector('.films');


const popularMovies = [
    "GLADIATOR II",
    "Wicked",
    "Carry-On",
];

async function getTrendingMovies() {
    try {
        const moviePromises = popularMovies.slice(0, 8).map(async (title) => {
            const response = await fetch(`${BASE_URL}?apikey=${OMDB_API_KEY}&t=${title}&type=movie`);
            const data = await response.json();
            return data;
        });

        const movies = await Promise.all(moviePromises);
        displayMovies(movies.filter(movie => movie.Response === "True"));
    } catch (error) {
        console.error('Erreur:', error);
        filmsContainer.innerHTML = '<p>Erreur lors du chargement des films</p>';
    }
}

function displayMovies(movies) {
    filmsContainer.innerHTML = '';
    
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'box';
        
        movieElement.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'Assets/icons/no-poster.png'}" alt="${movie.Title}">
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>Année: ${movie.Year}</p>
                <p>Note: ${movie.imdbRating}/10</p>
                <p>Genre: ${movie.Genre}</p>
                <button class="more">Détails</button>
            </div>
        `;
        
        filmsContainer.appendChild(movieElement);
    });
}

async function searchMovies(searchTerm, page = 1) {
    try {
        const response = await fetch(`${BASE_URL}?apikey=${OMDB_API_KEY}&s=${searchTerm}&type=movie&page=${page}`);
        const data = await response.json();
        
        if (data.Response === "True") {
            const detailedMovies = await Promise.all(
                data.Search.slice(0, 8).map(async (movie) => {
                    const detailResponse = await fetch(`${BASE_URL}?apikey=${OMDB_API_KEY}&i=${movie.imdbID}`);
                    return detailResponse.json();
                })
            );
            displayMovies(detailedMovies);
        } else {
            filmsContainer.innerHTML = '<p>Aucun film trouvé</p>';
        }
    } catch (error) {
        console.error('Erreur:', error);
        filmsContainer.innerHTML = '<p>Erreur lors de la recherche</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getTrendingMovies();
    
    
    const searchInput = document.querySelector('.search-input');
    const searchForm = document.querySelector('.search-form');

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm && searchTerm.length >= 3) {
            searchMovies(searchTerm);
        } else if (searchTerm) {
            alert('Veuillez entrer au moins 3 caractères pour la recherche');
        }
    });
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

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('more')) {
        const movieInfo = event.target.closest('.movie-info');
        const title = movieInfo.querySelector('h3').textContent;
        window.location.href = `movie.html?title=${title}`;
    }    
});