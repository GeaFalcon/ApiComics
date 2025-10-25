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
        <nav className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md shadow-2xl sticky top-0 z-50 border-b border-slate-700/50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <div
                        className="cursor-pointer group flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10"
                        onClick={() => onNavigate('home')}
                    >
                        <div className="text-3xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                            📚
                        </div>
                        <div>
                            <h1 className="text-white text-2xl font-black m-0 bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                                Comic Reader
                            </h1>
                            <p className="text-slate-400 text-xs m-0 font-medium tracking-wide">Tu biblioteca digital</p>
                        </div>
                    </div>

                    {/* Navigation Section */}
                    {isAuthenticated ? (
                        <div className="flex gap-2 items-center">
                            {/* Main Navigation */}
                            <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1 backdrop-blur-sm">
                                <button
                                    className={`bg-transparent border-none text-slate-300 cursor-pointer text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-200 hover:bg-slate-700/70 hover:text-white hover:shadow-lg hover:shadow-red-500/10 ${currentView === 'home' ? 'bg-slate-700/70 text-white' : ''}`}
                                    onClick={() => onNavigate('home')}
                                >
                                    🏠 Inicio
                                </button>
                                <button
                                    className={`bg-transparent border-none text-slate-300 cursor-pointer text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-200 hover:bg-slate-700/70 hover:text-white hover:shadow-lg hover:shadow-red-500/10 ${currentView === 'series-list' ? 'bg-slate-700/70 text-white' : ''}`}
                                    onClick={() => onNavigate('series-list')}
                                >
                                    📖 Series
                                </button>
                                <button
                                    className={`bg-transparent border-none text-slate-300 cursor-pointer text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-200 hover:bg-slate-700/70 hover:text-white hover:shadow-lg hover:shadow-red-500/10 ${currentView === 'favorites' ? 'bg-slate-700/70 text-white' : ''}`}
                                    onClick={() => onNavigate('favorites')}
                                >
                                    ❤️ Favoritos
                                </button>
                                <button
                                    className={`bg-transparent border-none text-slate-300 cursor-pointer text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-200 hover:bg-slate-700/70 hover:text-white hover:shadow-lg hover:shadow-red-500/10 ${currentView === 'history' ? 'bg-slate-700/70 text-white' : ''}`}
                                    onClick={() => onNavigate('history')}
                                >
                                    🕐 Historial
                                </button>
                            </div>

                            {/* Secondary Actions */}
                            <div className="flex gap-2 items-center ml-2">
                                <button
                                    className="bg-gradient-to-r from-red-500 to-orange-500 border-none text-white cursor-pointer text-sm font-bold px-5 py-2.5 rounded-lg transition-all duration-200 hover:from-red-600 hover:to-orange-600 hover:shadow-lg hover:shadow-red-500/30 hover:scale-105"
                                    onClick={() => onNavigate('upload')}
                                >
                                    ➕ Subir Comic
                                </button>

                                <div className="relative group">
                                    <button
                                        className="bg-slate-800/80 border-none text-slate-300 cursor-pointer text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-200 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                                        onClick={() => onNavigate('profile')}
                                    >
                                        👤 {user?.username}
                                    </button>
                                </div>

                                {isAdmin && (
                                    <button
                                        className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400 cursor-pointer text-sm font-bold px-4 py-2.5 rounded-lg transition-all duration-200 hover:from-yellow-500/30 hover:to-amber-500/30 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/20"
                                        onClick={() => onNavigate('admin')}
                                    >
                                        ⚙️ Admin
                                    </button>
                                )}

                                <button
                                    className="bg-slate-800/80 border border-slate-700 text-slate-400 cursor-pointer text-sm px-4 py-2.5 rounded-lg transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                                    onClick={handleLogout}
                                >
                                    🚪 Salir
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-3 items-center">
                            <button
                                className="bg-slate-800/80 border border-slate-700 text-slate-300 cursor-pointer text-base font-medium px-6 py-2.5 rounded-lg transition-all duration-200 hover:bg-slate-700 hover:text-white hover:border-slate-600"
                                onClick={() => onNavigate('login')}
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                className="bg-gradient-to-r from-red-500 to-orange-500 border-none text-white cursor-pointer text-base font-bold px-6 py-2.5 rounded-lg transition-all duration-200 hover:from-red-600 hover:to-orange-600 hover:shadow-lg hover:shadow-red-500/30 hover:scale-105"
                                onClick={() => onNavigate('register')}
                            >
                                Registrarse
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
