document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    const categoryQuery = urlParams.get('category');
    
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchQuery) {
        searchInput.value = searchQuery;
        searchMovies(searchQuery);
    } else if (categoryQuery) {
        loadCategoryMovies(categoryQuery);
    } else {
        loadExploreMovies();
    }

    let debounceTimer;
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query.length === 0) {
            loadExploreMovies(); // Reload default list if search is empty
            return;
        }
        searchMovies(query);
    }

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch();
        }, 500);
    });

    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            clearTimeout(debounceTimer);
            performSearch();
        }
    });
});

async function loadCategoryMovies(category) {
    const container = document.getElementById('exploreMovies');
    container.innerHTML = '<div class="loading">Loading category...</div>';
    
    let endpoint = '/discover/movie';
    let params = { sort_by: 'popularity.desc', page: 1 };

    switch(category) {
        case 'trending': endpoint = '/trending/movie/day'; params = {}; break;
        case 'top_rated': endpoint = '/movie/top_rated'; params = {}; break;
        case 'now_playing': endpoint = '/movie/now_playing'; params = {}; break;
        case 'upcoming': endpoint = '/movie/upcoming'; params = {}; break;
        case 'international': endpoint = '/discover/movie'; params = { with_original_language: 'ko|fr|es|ja', sort_by: 'popularity.desc' }; break;
        case 'indian': endpoint = '/discover/movie'; params = { with_original_language: 'hi|te|ta', sort_by: 'popularity.desc' }; break;
    }

    try {
        const [page1, page2] = await Promise.all([
            fetchFromAPI(endpoint, { ...params, page: 1 }),
            fetchFromAPI(endpoint, { ...params, page: 2 })
        ]);
        const allMovies = [...(page1.results || []), ...(page2.results || [])];
        renderMovies('exploreMovies', allMovies);
    } catch (error) {
        console.error('Error loading category movies:', error);
        container.innerHTML = `
            <div style="text-align: center; color: #ef4444; padding: 2rem; background: rgba(239, 68, 68, 0.1); border-radius: 8px;">
                <h3>API Error</h3>
                <p>Could not load category. Please check your TMDB API Key.</p>
                <p style="font-size: 0.8rem; margin-top: 1rem; color: #aaa;">Error details: ${error.message}</p>
            </div>
        `;
    }
}

async function loadExploreMovies() {
    const container = document.getElementById('exploreMovies');
    container.innerHTML = '<div class="loading">Loading massive movie collection...</div>';
    try {
        const [page1, page2] = await Promise.all([
            fetchFromAPI('/discover/movie', { sort_by: 'popularity.desc', page: 1 }),
            fetchFromAPI('/discover/movie', { sort_by: 'popularity.desc', page: 2 })
        ]);
        
        const allMovies = [...(page1.results || []), ...(page2.results || [])];
        renderMovies('exploreMovies', allMovies);
    } catch (error) {
        console.error('Error loading explore movies:', error);
        container.innerHTML = `
            <div style="text-align: center; color: #ef4444; padding: 2rem; background: rgba(239, 68, 68, 0.1); border-radius: 8px;">
                <h3>API Error</h3>
                <p>Could not load movies. Please check your TMDB API Key.</p>
                <p style="font-size: 0.8rem; margin-top: 1rem; color: #aaa;">Error details: ${error.message}</p>
            </div>
        `;
    }
}

async function searchMovies(query) {
    const container = document.getElementById('exploreMovies');
    container.innerHTML = '<div class="loading">Searching movies...</div>';

    try {
        const data = await fetchFromAPI('/search/movie', { query });
        if (data.results && data.results.length > 0) {
            renderMovies('exploreMovies', data.results);
        } else {
            container.innerHTML = '<div class="loading">No movies found. Try searching for another movie.</div>';
        }
    } catch (error) {
        console.error('Search error:', error);
        container.innerHTML = '<div class="loading">Something went wrong. Please try again.</div>';
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
