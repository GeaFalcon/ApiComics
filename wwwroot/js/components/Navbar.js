const { useState, useEffect } = React;

function Navbar({ onNavigate, currentView }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(Auth.getUser());
    }, [currentView]);

    const handleLogout = () => {
        Auth.logout();
        onNavigate('login');
    };

    const isAuthenticated = Auth.isAuthenticated();
    const isAdmin = Auth.isAdmin();

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <div style={styles.brand} onClick={() => onNavigate('home')}>
                    <h1 style={styles.title}>Comic Reader</h1>
                </div>

                {isAuthenticated ? (
                    <div style={styles.navLinks}>
                        <button style={styles.navButton} onClick={() => onNavigate('home')}>
                            Inicio
                        </button>
                        <button style={styles.navButton} onClick={() => onNavigate('series-list')}>
                            Series
                        </button>
                        <button style={styles.navButton} onClick={() => onNavigate('favorites')}>
                            Favoritos
                        </button>
                        <button style={styles.navButton} onClick={() => onNavigate('history')}>
                            Historial
                        </button>
                        <button style={styles.navButton} onClick={() => onNavigate('upload')}>
                            Subir Comic
                        </button>
                        <button style={styles.navButton} onClick={() => onNavigate('profile')}>
                            Mi Perfil
                        </button>
                        {isAdmin && (
                            <button style={{...styles.navButton, ...styles.adminButton}} onClick={() => onNavigate('admin')}>
                                Panel Admin
                            </button>
                        )}
                        <div style={styles.userInfo}>
                            <span style={styles.username}>{user?.username}</span>
                            <button style={styles.logoutButton} onClick={handleLogout}>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={styles.navLinks}>
                        <button style={styles.navButton} onClick={() => onNavigate('login')}>
                            Iniciar Sesión
                        </button>
                        <button style={{...styles.navButton, ...styles.registerButton}} onClick={() => onNavigate('register')}>
                            Registrarse
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1rem 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    brand: {
        cursor: 'pointer'
    },
    title: {
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        margin: 0
    },
    navLinks: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
    },
    navButton: {
        background: 'transparent',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontSize: '1rem',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        transition: 'background 0.3s',
        ':hover': {
            background: 'rgba(255,255,255,0.1)'
        }
    },
    adminButton: {
        background: 'rgba(255, 193, 7, 0.3)',
        fontWeight: 'bold'
    },
    registerButton: {
        background: 'rgba(255,255,255,0.2)',
        fontWeight: 'bold'
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginLeft: '1rem',
        paddingLeft: '1rem',
        borderLeft: '1px solid rgba(255,255,255,0.3)'
    },
    username: {
        color: 'white',
        fontWeight: 'bold'
    },
    logoutButton: {
        background: 'rgba(255,255,255,0.2)',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontSize: '0.9rem',
        padding: '0.4rem 0.8rem',
        borderRadius: '5px'
    }
};
