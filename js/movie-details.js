document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    const autoBook = urlParams.get('book');

    if (!movieId) {
        document.getElementById('detailsContainer').innerHTML = '<p>Movie not found.</p>';
        return;
    }

    let currentMovie = null;

    // Set minimum date for booking to today
    const dateInput = document.getElementById('bookDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        dateInput.value = today;
    }

    async function loadMovieDetails() {
        try {
            currentMovie = await fetchFromAPI(`/movie/${movieId}`);
            renderDetails(currentMovie);

            if (autoBook === 'true') {
                openBookingModal();
            }
        } catch (error) {
            console.error('Error fetching details:', error);
            document.getElementById('detailsContainer').innerHTML = '<p>Error loading movie details.</p>';
        }
    }

    function renderDetails(movie) {
        const container = document.getElementById('detailsContainer');
        const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        const language = movie.original_language ? movie.original_language.toUpperCase() : 'N/A';
        const genres = movie.genres ? movie.genres.map(g => g.name).join(', ') : 'N/A';
        const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';

        container.innerHTML = `
            <div class="details-poster">
                <img src="${getImageUrl(movie.poster_path)}" alt="${movie.title || movie.name}">
            </div>
            <div class="details-info">
                <h1>${movie.title || movie.name}</h1>
                <div class="details-meta">
                    <span class="badge">⭐ ${rating}</span>
                    <span class="badge">${year}</span>
                    <span class="badge">${language}</span>
                    <span class="badge">${runtime}</span>
                </div>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;"><strong>Genres:</strong> ${genres}</p>
                <div class="details-overview">${movie.overview}</div>
                
                <button class="btn btn-primary" id="pageBookBtn" style="font-size: 1.1rem; padding: 1rem 3rem;">Book Ticket</button>
            </div>
        `;

        document.getElementById('pageBookBtn').addEventListener('click', openBookingModal);
    }

    const modal = document.getElementById('bookingModal');
    const closeModal = document.getElementById('closeModal');
    const bookingForm = document.getElementById('bookingForm');
    const successModal = document.getElementById('successModal');

    function openBookingModal() {
        if (!currentMovie) return;
        
        const infoContainer = document.getElementById('bookingMovieInfo');
        const year = currentMovie.release_date ? currentMovie.release_date.split('-')[0] : 'N/A';
        const language = currentMovie.original_language ? currentMovie.original_language.toUpperCase() : 'N/A';

        infoContainer.innerHTML = `
            <img src="${getImageUrl(currentMovie.poster_path, 'w200')}" style="width: 60px; height: 90px; object-fit: cover; border-radius: 8px;">
            <div>
                <h3 style="margin-bottom: 0.2rem;">${currentMovie.title || currentMovie.name}</h3>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">${language} • ${year}</p>
            </div>
        `;

        modal.style.display = 'flex';
    }

    closeModal.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const numTickets = document.getElementById('numTickets').value;
        const bookDate = document.getElementById('bookDate').value;
        const bookTime = document.getElementById('bookTime').value;
        
        // Generate booking ID (CB + YearMonthDay + random 4 digits)
        const dateStr = new Date().toISOString().slice(0,10).replace(/-/g, '');
        const randomStr = Math.floor(1000 + Math.random() * 9000);
        const bookingId = `CB${dateStr}${randomStr}`;

        const booking = {
            id: bookingId,
            movieId: currentMovie.id,
            movieTitle: currentMovie.title || currentMovie.name,
            posterPath: currentMovie.poster_path,
            tickets: numTickets,
            date: bookDate,
            time: bookTime,
            status: 'Confirmed',
            createdAt: new Date().toISOString(),
            userEmail: sessionStorage.getItem('userEmail')
        };

        // Save to localStorage
        let bookings = JSON.parse(localStorage.getItem('cinebook_bookings')) || [];
        bookings.unshift(booking);
        localStorage.setItem('cinebook_bookings', JSON.stringify(bookings));

        // Show success modal
        modal.style.display = 'none';
        showSuccessModal(booking);
    });

    function showSuccessModal(booking) {
        const detailsContainer = document.getElementById('successDetails');
        
        // Format date for display
        const dateObj = new Date(booking.date);
        const dateDisplay = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

        detailsContainer.innerHTML = `
            <p style="margin-bottom: 0.5rem;"><strong>Booking ID:</strong> <span style="color: #fff;">${booking.id}</span></p>
            <p style="margin-bottom: 0.5rem;"><strong>Movie:</strong> <span style="color: #fff;">${booking.movieTitle}</span></p>
            <p style="margin-bottom: 0.5rem;"><strong>Tickets:</strong> <span style="color: #fff;">${booking.tickets}</span></p>
            <p style="margin-bottom: 0.5rem;"><strong>Date:</strong> <span style="color: #fff;">${dateDisplay}</span></p>
            <p style="margin-bottom: 0.5rem;"><strong>Time:</strong> <span style="color: #fff;">${booking.time}</span></p>
            <p><strong>Status:</strong> <span style="color: #10b981;">${booking.status}</span></p>
        `;

        successModal.style.display = 'flex';
    }

    loadMovieDetails();
});
