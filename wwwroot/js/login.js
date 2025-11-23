const API_URL = 'http://localhost:5228/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    
    try {
        const response = await fetch(`${API_URL}/Auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Lưu token và email vào localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', data.email);
            localStorage.setItem('roles', JSON.stringify(data.roles));
            
            messageDiv.textContent = 'Login successful! Redirecting...';
            messageDiv.className = 'message success';
            
            // Redirect sau 1 giây
            setTimeout(() => {
                window.location.href = '/products.html';
            }, 1000);
        } else {
            messageDiv.textContent = data.message || 'Login failed!';
            messageDiv.className = 'message error';
        }
    } catch (error) {
        messageDiv.textContent = 'Error: ' + error.message;
        messageDiv.className = 'message error';
    }
});