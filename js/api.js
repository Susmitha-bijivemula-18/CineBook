const API_KEY = 'f2b62e7f374687e23426f9c8a905b58a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// Fetch wrapper for TMDB API
async function fetchFromAPI(endpoint, params = {}) {
    try {
        const queryParams = new URLSearchParams({
            api_key: API_KEY,
            ...params
        });
        
        const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Get full image URL
function getImageUrl(path, size = 'w500') {
    if (!path) return 'https://placehold.co/500x750/1e293b/ffffff?text=No+Poster+Available';
    return `${IMAGE_BASE_URL}${size}${path}`;
}
