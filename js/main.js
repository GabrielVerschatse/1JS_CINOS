const OMDB_API_KEY = 'fb886a74';
const BASE_URL = 'https://www.omdbapi.com/';
const filmsContainer = document.querySelector('.films');
const loadMoreBtn = document.getElementById('loadMore');

const movies2024 = {
    'upcoming': [
        "GLADIATOR II", "Wicked", "Deadpool 3", "Inside Out 2", "Mufasa: The Lion King",
        "Furiosa", "Kingdom of the Planet of the Apes", "Godzilla x Kong", "Despicable Me 4", 
        "Captain America: Brave New World", "Garfield", "Ghostbusters: Frozen Empire",
        "Bad Boys 4", "The Fall Guy", "Kung Fu Panda 4", "Mickey 17", "Nosferatu",
        "Civil War", "Lord of the Rings: The War of the Rohirrim", "Carry-On", "Blink Twice"
    ]
};

function getRandomMovies(count) {
    const shuffled = [...movies2024.upcoming].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function loadMoreMovies() {
    try {
        const randomMovies = getRandomMovies(5);
        const moviePromises = randomMovies.map(async (title) => {
            const response = await fetch(`${BASE_URL}?apikey=${OMDB_API_KEY}&t=${title}&type=movie`);
            return response.json();
        });

        const movies = await Promise.all(moviePromises);
        displayMovies(movies.filter(movie => movie.Response === "True"), false);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function displayMovies(movies, clearContainer = false) {
    if (clearContainer) {
        filmsContainer.innerHTML = '';
    }
    
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
                <button class="more">En savoir plus</button>
            </div>
        `;
        
        filmsContainer.appendChild(movieElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadMoreMovies();
});

loadMoreBtn.addEventListener('click', loadMoreMovies);

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