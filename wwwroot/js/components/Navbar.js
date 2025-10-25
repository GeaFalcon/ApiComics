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
        <nav className="bg-gradient-to-r from-primary-500 to-primary-600 py-4 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                <div className="cursor-pointer" onClick={() => onNavigate('home')}>
                    <h1 className="text-white text-2xl font-bold m-0">Comic Reader</h1>
                </div>

                {isAuthenticated ? (
                    <div className="flex gap-4 items-center">
                        <button className="bg-transparent border-none text-white cursor-pointer text-base px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10" onClick={() => onNavigate('home')}>
                            Inicio
                        </button>
                        <button className="bg-transparent border-none text-white cursor-pointer text-base px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10" onClick={() => onNavigate('series-list')}>
                            Series
                        </button>
                        <button className="bg-transparent border-none text-white cursor-pointer text-base px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10" onClick={() => onNavigate('favorites')}>
                            Favoritos
                        </button>
                        <button className="bg-transparent border-none text-white cursor-pointer text-base px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10" onClick={() => onNavigate('history')}>
                            Historial
                        </button>
                        <button className="bg-transparent border-none text-white cursor-pointer text-base px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10" onClick={() => onNavigate('upload')}>
                            Subir Comic
                        </button>
                        <button className="bg-transparent border-none text-white cursor-pointer text-base px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10" onClick={() => onNavigate('profile')}>
                            Mi Perfil
                        </button>
                        {isAdmin && (
                            <button className="bg-yellow-500/30 border-none text-white cursor-pointer text-base px-4 py-2 rounded-md transition-all duration-300 hover:bg-yellow-500/50 font-bold" onClick={() => onNavigate('admin')}>
                                Panel Admin
                            </button>
                        )}
                        <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/30">
                            <span className="text-white font-bold">{user?.username}</span>
                            <button className="bg-white/20 border-none text-white cursor-pointer text-sm px-3 py-2 rounded-md transition-all duration-300 hover:bg-white/30" onClick={handleLogout}>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4 items-center">
                        <button className="bg-transparent border-none text-white cursor-pointer text-base px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10" onClick={() => onNavigate('login')}>
                            Iniciar Sesión
                        </button>
                        <button className="bg-white/20 border-none text-white cursor-pointer text-base px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/30 font-bold" onClick={() => onNavigate('register')}>
                            Registrarse
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
