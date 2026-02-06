// Register page script
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const lengthReq = document.getElementById('lengthReq');
const numberReq = document.getElementById('numberReq');
const symbolReq = document.getElementById('symbolReq');

// Real-time password validation
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;

    // Length check
    if (password.length >= 10) {
        lengthReq.classList.add('valid');
        lengthReq.classList.remove('invalid');
    } else {
        lengthReq.classList.add('invalid');
        lengthReq.classList.remove('valid');
    }

    // Number check
    if (/\d/.test(password)) {
        numberReq.classList.add('valid');
        numberReq.classList.remove('invalid');
    } else {
        numberReq.classList.add('invalid');
        numberReq.classList.remove('valid');
    }

    // Symbol check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        symbolReq.classList.add('valid');
        symbolReq.classList.remove('invalid');
    } else {
        symbolReq.classList.add('invalid');
        symbolReq.classList.remove('valid');
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const registerBtn = document.getElementById('registerBtn');
    const alertContainer = document.getElementById('alertContainer');

    // Clear previous errors
    alertContainer.innerHTML = '';

    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    // Validate password requirements
    if (password.length < 10) {
        showAlert('Password must be at least 10 characters long', 'error');
        return;
    }

    if (!/\d/.test(password)) {
        showAlert('Password must contain at least one number', 'error');
        return;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        showAlert('Password must contain at least one symbol', 'error');
        return;
    }

    // Disable button
    registerBtn.disabled = true;
    registerBtn.textContent = 'Creating account...';

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (data.success) {
            showAlert('Account created successfully! Redirecting to login...', 'success');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1500);
        } else {
            const errorMessage = data.details ? data.details.join(', ') : data.error;
            showAlert(errorMessage || 'Registration failed', 'error');
            registerBtn.disabled = false;
            registerBtn.textContent = 'Create Account';
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('An error occurred. Please try again.', 'error');
        registerBtn.disabled = false;
        registerBtn.textContent = 'Create Account';
    }
});

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    alertContainer.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
}
