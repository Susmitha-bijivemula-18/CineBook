document.addEventListener('DOMContentLoaded', () => {
    loadBookings();
});

function loadBookings() {
    const grid = document.getElementById('bookingsGrid');
    const allBookings = JSON.parse(localStorage.getItem('cinebook_bookings')) || [];
    const currentUserEmail = sessionStorage.getItem('userEmail');
    
    // Filter bookings by current user's email
    const bookings = allBookings.filter(booking => booking.userEmail === currentUserEmail);

    if (bookings.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: var(--surface-color); border-radius: 12px; border: 1px solid var(--border-color);">
                <div style="font-size: 3rem; margin-bottom: 1rem; color: var(--text-secondary);">🎫</div>
                <h2 style="margin-bottom: 1rem; color: var(--text-secondary);">You haven't booked any tickets yet.</h2>
                <button class="btn btn-primary" onclick="window.location.href='movies.html'">Explore Movies</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = bookings.map(booking => {
        // Format date for display
        const dateObj = new Date(booking.date);
        const dateDisplay = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

        return `
            <div class="booking-card">
                <img src="${getImageUrl(booking.posterPath, 'w200')}" alt="${booking.movieTitle}">
                <div class="booking-info" style="flex: 1;">
                    <h3>${booking.movieTitle}</h3>
                    <p style="font-size: 0.8rem; margin-bottom: 0.8rem;">ID: ${booking.id}</p>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
                        <p>Tickets: <span style="color: #fff;">${booking.tickets}</span></p>
                        <p>Date: <span style="color: #fff;">${dateDisplay}</span></p>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <p>Time: <span style="color: #fff;">${booking.time}</span></p>
                        <span class="status" style="background: rgba(16, 185, 129, 0.1); padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.85rem;">${booking.status}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
