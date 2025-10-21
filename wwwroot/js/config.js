// Configuración de la aplicación
const API_BASE_URL = window.location.origin;

const API_ENDPOINTS = {
    // Auth
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    ME: `${API_BASE_URL}/api/auth/me`,
    USERS: `${API_BASE_URL}/api/auth/users`,

    // Comics
    COMICS: `${API_BASE_URL}/api/comics`,
    COMICS_PENDING: `${API_BASE_URL}/api/comics/pending`,
    COMICS_MY_UPLOADS: `${API_BASE_URL}/api/comics/my-uploads`,
    COMICS_UPLOAD: `${API_BASE_URL}/api/comics/upload`,
    COMIC_BY_ID: (id) => `${API_BASE_URL}/api/comics/${id}`,
    COMIC_APPROVE: (id) => `${API_BASE_URL}/api/comics/${id}/approve`,
    COMIC_REJECT: (id) => `${API_BASE_URL}/api/comics/${id}/reject`,
    COMIC_DOWNLOAD: (id) => `${API_BASE_URL}/api/comics/download/${id}`,
    COMIC_VIEW: (id) => `${API_BASE_URL}/api/comics/view/${id}`,
    COMIC_VIEW_PAGES: (id) => `${API_BASE_URL}/api/comics/view/pages/${id}`,

    // User Interactions
    FAVORITES: `${API_BASE_URL}/api/user/favorites`,
    FAVORITE_ADD: (id) => `${API_BASE_URL}/api/user/favorites/${id}`,
    FAVORITE_REMOVE: (id) => `${API_BASE_URL}/api/user/favorites/${id}`,

    VOTES: `${API_BASE_URL}/api/user/votes`,
    VOTE_ADD: (id) => `${API_BASE_URL}/api/user/votes/${id}`,
    VOTE_REMOVE: (id) => `${API_BASE_URL}/api/user/votes/${id}`,
    VOTE_CHECK: (id) => `${API_BASE_URL}/api/user/votes/check/${id}`,

    HISTORY: `${API_BASE_URL}/api/user/history`,
    HISTORY_ADD: (id) => `${API_BASE_URL}/api/user/history/${id}`,
    HISTORY_REMOVE: (id) => `${API_BASE_URL}/api/user/history/${id}`,

    USER_STATS: `${API_BASE_URL}/api/user/stats`
};
