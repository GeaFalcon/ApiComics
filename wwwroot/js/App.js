const { useState, useEffect } = React;

function App() {
    const [currentView, setCurrentView] = useState('home');
    const [viewData, setViewData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verificar autenticación al cargar
        setIsAuthenticated(Auth.isAuthenticated());

        // Manejar navegación por hash
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#/', '') || 'home';
            if (!Auth.isAuthenticated() && hash !== 'login' && hash !== 'register') {
                setCurrentView('login');
            } else {
                setCurrentView(hash);
            }
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleNavigate = (view, data = null) => {
        setCurrentView(view);
        setViewData(data);
        window.location.hash = `#/${view}`;
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const renderView = () => {
        // Vistas públicas
        if (!isAuthenticated) {
            if (currentView === 'register') {
                return <Register onNavigate={handleNavigate} onLogin={handleLogin} />;
            }
            return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
        }

        // Vistas autenticadas
        switch (currentView) {
            case 'home':
                return <Home onNavigate={handleNavigate} />;

            case 'upload':
                return <ComicUpload onNavigate={handleNavigate} />;

            case 'favorites':
                return <Favorites onNavigate={handleNavigate} />;

            case 'history':
                return <ReadingHistory onNavigate={handleNavigate} />;

            case 'profile':
                return <UserProfile onNavigate={handleNavigate} />;

            case 'admin':
                if (!Auth.isAdmin()) {
                    return <div style={styles.accessDenied}>Acceso denegado. Solo administradores.</div>;
                }
                return <AdminPanel onNavigate={handleNavigate} />;

            case 'comic-detail':
                if (!viewData || !viewData.id) {
                    return <div style={styles.error}>Comic no encontrado</div>;
                }
                return <ComicDetail comicId={viewData.id} onNavigate={handleNavigate} />;

            case 'login':
                handleNavigate('home');
                return <Home onNavigate={handleNavigate} />;

            default:
                return <Home onNavigate={handleNavigate} />;
        }
    };

    return (
        <div>
            <Navbar onNavigate={handleNavigate} currentView={currentView} />
            <main>
                {renderView()}
            </main>
            <footer style={styles.footer}>
                <p>Comic Reader Platform &copy; 2025 - Desarrollado con React y ASP.NET Core</p>
            </footer>
        </div>
    );
}

const styles = {
    accessDenied: {
        maxWidth: '600px',
        margin: '5rem auto',
        padding: '2rem',
        textAlign: 'center',
        background: '#fee',
        color: '#c33',
        borderRadius: '10px',
        fontSize: '1.2rem'
    },
    error: {
        maxWidth: '600px',
        margin: '5rem auto',
        padding: '2rem',
        textAlign: 'center',
        background: '#fee',
        color: '#c33',
        borderRadius: '10px'
    },
    footer: {
        marginTop: '4rem',
        padding: '2rem',
        textAlign: 'center',
        background: '#f5f5f5',
        color: '#666',
        borderTop: '1px solid #ddd'
    }
};

// Inicializar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
