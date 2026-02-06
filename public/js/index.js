// Index page initialization script

// Initialize authentication manager
const authManager = new AuthManager();

// Check session on page load
(async () => {
    const session = await authManager.checkSession();
    const authMenuItems = document.getElementById('authMenuItems');
    
    if (session.authenticated) {
        // User is logged in
        authMenuItems.innerHTML = `
            <span style="color: var(--text-secondary); margin-right: 15px;">
                Welcome, ${session.user.username}
            </span>
            <button id="logoutBtn" class="btn btn-secondary" style="padding: 8px 16px;">Logout</button>
        `;
        
        // Start session checking
        authManager.init();
        
        // Add logout handler
        document.getElementById('logoutBtn').addEventListener('click', () => {
            authManager.logout();
        });
    } else {
        // User is not logged in
        authMenuItems.innerHTML = `
            <a href="/login.html" class="btn btn-primary" style="padding: 8px 16px;">Login</a>
            <a href="/register.html" class="btn btn-secondary" style="padding: 8px 16px; margin-left: 10px;">Sign Up</a>
        `;
    }
})();
