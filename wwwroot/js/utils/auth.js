// Utilidades de autenticación
const Auth = {
    setToken(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    getToken() {
        return localStorage.getItem('token');
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'Admin';
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getAuthHeaders() {
        const token = this.getToken();
        return token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        };
    },

    getAuthHeadersForFormData() {
        const token = this.getToken();
        return token ? {
            'Authorization': `Bearer ${token}`
        } : {};
    }
};
