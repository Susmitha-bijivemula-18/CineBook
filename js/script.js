const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');
const loginForm = document.querySelector('.login-form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');

// Create message div
const messageDiv = document.createElement('div');
messageDiv.style.marginTop = '1rem';
messageDiv.style.textAlign = 'center';
messageDiv.style.fontWeight = '500';
messageDiv.style.transition = 'all 0.3s ease';
loginForm.appendChild(messageDiv);

togglePassword.addEventListener('click', function () {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    
    if (type === 'text') {
        this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
    } else {
        this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    }
});

loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const pass = passwordInput.value;
    
    messageDiv.textContent = 'Checking...';
    messageDiv.style.color = 'var(--text-secondary)';
    
    let users = [];

    try {
        // Fetch the users.json file
        const response = await fetch('users.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        users = await response.json();
    } catch (error) {
        // FALLBACK for when there is no live server (CORS error on file:///)
        // We use the exact data from users.json so it works even without a server
        users = [
          { "name": "Susmita", "email": "susmita@gmail.com", "password": "Susmita@123" },
          { "name": "Rahul", "email": "rahul@gmail.com", "password": "Rahul@123" },
          { "name": "Priya", "email": "priya@gmail.com", "password": "Priya@123" },
          { "name": "Arjun", "email": "arjun@gmail.com", "password": "Arjun@123" },
          { "name": "Sneha", "email": "sneha@gmail.com", "password": "Sneha@123" }
        ];
    }
    
    // Find matching user (by email, name, or mobile)
    const user = users.find(u => 
        (u.email === username || u.name === username || u.mobile === username) && u.password === pass
    );

    if (user) {
        messageDiv.style.color = '#10b981'; // Success Green
        messageDiv.textContent = 'Login was successful! Redirecting...';
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userName', user.name);
        sessionStorage.setItem('userEmail', user.email);
        setTimeout(() => {
            window.location.href = 'movies.html';
        }, 1000);
    } else {
        messageDiv.style.color = '#f59e0b'; // Warning Amber/Orange (instead of red)
        messageDiv.textContent = 'The details were wrong please try again';
    }
});
