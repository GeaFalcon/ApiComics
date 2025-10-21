// Utilidades para llamadas a la API
const API = {
    async request(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers
                }
            });

            if (response.status === 401) {
                Auth.logout();
                window.location.hash = '#/login';
                throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.mensaje || `Error ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }

            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async get(url) {
        return this.request(url, {
            method: 'GET',
            headers: Auth.getAuthHeaders()
        });
    },

    async post(url, data) {
        return this.request(url, {
            method: 'POST',
            headers: Auth.getAuthHeaders(),
            body: JSON.stringify(data)
        });
    },

    async postFormData(url, formData) {
        return this.request(url, {
            method: 'POST',
            headers: Auth.getAuthHeadersForFormData(),
            body: formData
        });
    },

    async put(url, data = {}) {
        return this.request(url, {
            method: 'PUT',
            headers: Auth.getAuthHeaders(),
            body: JSON.stringify(data)
        });
    },

    async delete(url) {
        return this.request(url, {
            method: 'DELETE',
            headers: Auth.getAuthHeaders()
        });
    }
};
