// Utilidades para llamadas a la API
const API = {
    async request(url, options = {}) {
        try {
            console.log(`🌐 Fetch iniciado: ${options.method || 'GET'} ${url}`);
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers
                }
            });

            console.log(`📨 Respuesta recibida: Status ${response.status} ${response.statusText}`);

            if (response.status === 401) {
                console.log('🔒 Error 401 - Sesión expirada');
                Auth.logout();
                window.location.hash = '#/login';
                throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            }

            if (!response.ok) {
                console.error(`❌ Error HTTP: ${response.status} ${response.statusText}`);
                let errorData;
                try {
                    errorData = await response.json();
                    console.error('Error data:', errorData);
                } catch (e) {
                    console.error('No se pudo parsear error data como JSON');
                    errorData = {};
                }
                throw new Error(errorData.mensaje || `Error ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const jsonData = await response.json();
                console.log('✅ Respuesta JSON:', jsonData);
                return jsonData;
            }

            console.log('✅ Respuesta no-JSON recibida');
            return response;
        } catch (error) {
            console.error('💥 API Error en catch:', error);
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
        console.log('📤 API.postFormData llamado');
        console.log('  URL:', url);
        console.log('  Headers:', Auth.getAuthHeadersForFormData());
        console.log('  FormData entries:');
        for (let pair of formData.entries()) {
            if (pair[1] instanceof File) {
                console.log(`    ${pair[0]}:`, {
                    nombre: pair[1].name,
                    tipo: pair[1].type,
                    tamaño: pair[1].size
                });
            } else {
                console.log(`    ${pair[0]}:`, pair[1]);
            }
        }

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
