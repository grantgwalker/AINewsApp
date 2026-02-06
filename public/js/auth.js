// Authentication utilities for InsightStream

class AuthManager {
    constructor() {
        this.checkSessionInterval = null;
        this.sessionCheckFrequency = 60000; // Check every 60 seconds
    }

    /**
     * Initialize session checking
     */
    init() {
        this.startSessionCheck();
    }

    /**
     * Start periodic session checking
     */
    startSessionCheck() {
        // Check immediately
        this.checkSession();

        // Check periodically
        this.checkSessionInterval = setInterval(() => {
            this.checkSession();
        }, this.sessionCheckFrequency);
    }

    /**
     * Stop session checking
     */
    stopSessionCheck() {
        if (this.checkSessionInterval) {
            clearInterval(this.checkSessionInterval);
            this.checkSessionInterval = null;
        }
    }

    /**
     * Check if user has an active session
     */
    async checkSession() {
        try {
            const response = await fetch('/api/auth/session');
            const data = await response.json();

            if (data.success && !data.authenticated) {
                // Session expired or not logged in
                if (data.reason) {
                    console.log('Session check:', data.reason);
                    this.handleSessionExpired(data.reason);
                }
            }

            return data;
        } catch (error) {
            console.error('Session check error:', error);
            return { success: false, authenticated: false };
        }
    }

    /**
     * Handle session expiration
     */
    handleSessionExpired(reason) {
        this.stopSessionCheck();
        
        // Show notification
        const message = reason || 'Your session has expired';
        this.showNotification(message, 'warning');

        // Redirect to login after a delay
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 2000);
    }

    /**
     * Show notification to user
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'warning' ? 'rgba(245, 158, 11, 0.9)' : 'rgba(99, 102, 241, 0.9)'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // Add to DOM
        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST'
            });

            const data = await response.json();

            if (data.success) {
                this.stopSessionCheck();
                window.location.href = '/login.html';
            } else {
                console.error('Logout failed:', data.error);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    /**
     * Get user preferences
     */
    async getPreferences() {
        try {
            const response = await fetch('/api/auth/preferences');
            const data = await response.json();

            if (data.success) {
                return data.preferences;
            } else {
                console.error('Failed to get preferences:', data.error);
                return {};
            }
        } catch (error) {
            console.error('Get preferences error:', error);
            return {};
        }
    }

    /**
     * Update user preferences
     */
    async updatePreferences(preferences) {
        try {
            const response = await fetch('/api/auth/preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ preferences })
            });

            const data = await response.json();

            if (data.success) {
                return true;
            } else {
                console.error('Failed to update preferences:', data.error);
                return false;
            }
        } catch (error) {
            console.error('Update preferences error:', error);
            return false;
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
