// auth.js - Session management
document.addEventListener('DOMContentLoaded', () => {
    let isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
    // If no session exists, set default guest session
    if (isLoggedIn !== 'true') {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userName', 'Guest');
    }

    // Setup logout button if it exists
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Just clear session and reload splash screen on logout
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('userName');
            window.location.href = 'index.html';
        });
    });

    // Display username if element exists
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        userNameDisplay.textContent = sessionStorage.getItem('userName') || 'Guest';
    }
});
