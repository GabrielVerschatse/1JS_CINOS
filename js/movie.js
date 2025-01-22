const OMDB_API_KEY = 'fb886a74';
const BASE_URL = 'https://www.omdbapi.com/';
const filmsContainer = document.querySelector('.films');
url = new URL(window.location.href);
const title = url.searchParams.get('title');


const currentMovie = [
    title,
];

async function getTrendingMovies() {
    try {
        const moviePromises = currentMovie.slice(0, 8).map(async (title) => {
            const response = await fetch(`${BASE_URL}?apikey=${OMDB_API_KEY}&t=${title}&type=movie`);
            const data = await response.json();
            return data;
        });

        const movies = await Promise.all(moviePromises);
        displayMovies(movies.filter(movie => movie.Response === "True"));
    } catch (error) {
        console.error('Erreur:', error);
        filmsContainer.innerHTML = '<p><strong>Erreur lors du chargement des films</p>';
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
                <h3 style ="text-align:center; font-size:larger;" >${movie.Title}</h3>
                <p><strong>Date de sortie:</strong> ${movie.Released}</p>
                <p><strong>Note:</strong> ${movie.imdbRating}/10</p>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Réalisateur:</strong> ${movie.Director}</p>
                <p><strong>Acteurs:</strong> ${movie.Actors}</p>
                <p><strong>Durée:</strong> ${movie.Runtime}</p>
                <p><strong>Résumé:</strong> ${movie.Plot}</p>
            </div>
        `;
        
        filmsContainer.appendChild(movieElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    getTrendingMovies();
});

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