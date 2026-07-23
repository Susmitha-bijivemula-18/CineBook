document.addEventListener('DOMContentLoaded', () => {
    initDashboard();

    // Quick Search Form Logic
    const searchForm = document.getElementById('quickSearchForm');
    const searchInput = document.getElementById('quickSearchInput');

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `explore.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
});

async function initDashboard() {
    try {
        const [trending, popular, topRated, nowPlaying, upcoming] = await Promise.all([
            fetchFromAPI('/trending/movie/day'),
            fetchFromAPI('/movie/popular'),
            fetchFromAPI('/movie/top_rated'),
            fetchFromAPI('/movie/now_playing'),
            fetchFromAPI('/movie/upcoming')
        ]);

        renderMovies('trendingMovies', trending.results);
        renderMovies('popularMovies', popular.results);
        renderMovies('topRatedMovies', topRated.results);
        renderMovies('nowPlayingMovies', nowPlaying.results);
        renderMovies('upcomingMovies', upcoming.results);
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        document.getElementById('defaultSections').innerHTML = `
            <div style="text-align: center; color: #ef4444; padding: 2rem; background: rgba(239, 68, 68, 0.1); border-radius: 8px;">
                <h3>API Error</h3>
                <p>Could not load movies. Please check your TMDB API Key.</p>
                <p style="font-size: 0.8rem; margin-top: 1rem; color: #aaa;">Error details: ${error.message}</p>
            </div>
        `;
    }
}

function renderMovies(containerId, movies) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!movies || movies.length === 0) {
        container.innerHTML = '<p>No movies found.</p>';
        return;
    }

    container.innerHTML = movies.map(movie => createMovieCard(movie)).join('');
}

function createMovieCard(movie) {
    const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    
    return `
        <div class="movie-card" onclick="window.location.href='movie-details.html?id=${movie.id}'">
            <img src="${getImageUrl(movie.poster_path)}" alt="${movie.title || movie.name}">
            <div class="movie-card-info">
                <div class="movie-card-title">${movie.title || movie.name}</div>
                <div style="font-size: 0.8rem; color: #ccc;">
                    <span>⭐ ${rating}</span> | <span>${year}</span>
                </div>
            </div>
        </div>
    `;
}

// End of movies.js
