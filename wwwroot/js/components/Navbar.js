const { useState, useEffect } = React;

function Navbar({ onNavigate, currentView }) {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <>
            {/* Animated Background Pattern */}
            <style>{`
                @keyframes slidePattern {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 100% 100%; }
                }

                @keyframes glow {
                    0%, 100% { text-shadow: 0 0 10px rgba(248, 113, 113, 0.5), 0 0 20px rgba(251, 146, 60, 0.3); }
                    50% { text-shadow: 0 0 20px rgba(248, 113, 113, 0.8), 0 0 30px rgba(251, 146, 60, 0.5), 0 0 40px rgba(252, 211, 77, 0.3); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }

                @keyframes pulse-border {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
                }

                .nav-pattern {
                    background-image:
                        linear-gradient(45deg, rgba(239, 68, 68, 0.05) 25%, transparent 25%),
                        linear-gradient(-45deg, rgba(249, 115, 22, 0.05) 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, rgba(239, 68, 68, 0.05) 75%),
                        linear-gradient(-45deg, transparent 75%, rgba(249, 115, 22, 0.05) 75%);
                    background-size: 20px 20px;
                    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                    animation: slidePattern 20s linear infinite;
                }

                .manga-text {
                    font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive, sans-serif;
                    font-weight: 900;
                    letter-spacing: -0.5px;
                    text-transform: uppercase;
                    animation: glow 3s ease-in-out infinite;
                }

                .menu-item {
                    position: relative;
                    overflow: hidden;
                }

                .menu-item::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                }

                .menu-item:hover::before {
                    left: 100%;
                }

                .comic-border {
                    position: relative;
                }

                .comic-border::after {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    border-radius: inherit;
                    padding: 2px;
                    background: linear-gradient(45deg, #ef4444, #f97316, #eab308);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .comic-border:hover::after {
                    opacity: 0.6;
                }
            `}</style>

            <nav className="relative bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 shadow-2xl sticky top-0 z-50 border-b-4 border-red-600/30 nav-pattern">
                {/* Decorative top stripe */}
                <div className="h-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-3">
                        {/* Logo Section - Ultra Modern */}
                        <div
                            className="cursor-pointer group flex items-center gap-3 px-4 py-2 rounded-2xl transition-all duration-500 hover:scale-105 relative"
                            onClick={() => onNavigate('home')}
                            style={{ animation: 'float 3s ease-in-out infinite' }}
                        >
                            {/* Glow effect background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative flex items-center gap-3">
                                <div className="text-4xl transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 filter drop-shadow-lg">
                                    📚
                                </div>
                                <div>
                                    <h1 className="manga-text text-3xl m-0 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent drop-shadow-2xl">
                                        COMIC READER
                                    </h1>
                                    <p className="text-gray-400 text-xs m-0 font-bold tracking-widest uppercase">
                                        ⚡ Unlimited Reading ⚡
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Section */}
                        {isAuthenticated ? (
                            <div className="flex gap-3 items-center">
                                {/* Main Navigation - Comic Style Pills */}
                                <div className="hidden lg:flex gap-2 bg-gradient-to-r from-slate-900/90 to-slate-800/90 rounded-2xl p-2 backdrop-blur-xl border-2 border-slate-700/50 shadow-xl">
                                    <button
                                        className={`menu-item border-none cursor-pointer text-sm font-black px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 uppercase tracking-wide ${
                                            currentView === 'home'
                                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/50'
                                                : 'bg-transparent text-gray-300 hover:bg-slate-700/70 hover:text-white'
                                        }`}
                                        onClick={() => onNavigate('home')}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="text-xl">🏠</span>
                                            <span>Inicio</span>
                                        </span>
                                    </button>
                                    <button
                                        className={`menu-item border-none cursor-pointer text-sm font-black px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 uppercase tracking-wide ${
                                            currentView === 'series-list'
                                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/50'
                                                : 'bg-transparent text-gray-300 hover:bg-slate-700/70 hover:text-white'
                                        }`}
                                        onClick={() => onNavigate('series-list')}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="text-xl">📖</span>
                                            <span>Series</span>
                                        </span>
                                    </button>
                                    <button
                                        className={`menu-item border-none cursor-pointer text-sm font-black px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 uppercase tracking-wide ${
                                            currentView === 'favorites'
                                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/50'
                                                : 'bg-transparent text-gray-300 hover:bg-slate-700/70 hover:text-white'
                                        }`}
                                        onClick={() => onNavigate('favorites')}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="text-xl">❤️</span>
                                            <span>Favoritos</span>
                                        </span>
                                    </button>
                                    <button
                                        className={`menu-item border-none cursor-pointer text-sm font-black px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 uppercase tracking-wide ${
                                            currentView === 'history'
                                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/50'
                                                : 'bg-transparent text-gray-300 hover:bg-slate-700/70 hover:text-white'
                                        }`}
                                        onClick={() => onNavigate('history')}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="text-xl">🕐</span>
                                            <span>Historial</span>
                                        </span>
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="hidden lg:flex gap-2 items-center">
                                    {/* Upload Button - ULTRA Highlighted */}
                                    <button
                                        className="comic-border relative bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 border-none text-white cursor-pointer text-sm font-black px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/50 transform hover:scale-110 uppercase tracking-wide overflow-hidden"
                                        onClick={() => onNavigate('upload')}
                                        style={{ animation: 'pulse-border 2s infinite' }}
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <span className="text-xl">➕</span>
                                            <span>Subir</span>
                                        </span>
                                    </button>

                                    {/* User Profile */}
                                    <div className="relative">
                                        <button
                                            className="comic-border bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700/70 text-gray-200 cursor-pointer text-sm font-bold px-5 py-3 rounded-xl transition-all duration-300 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 flex items-center gap-2 transform hover:scale-105"
                                            onClick={() => onNavigate('profile')}
                                        >
                                            <span className="text-xl">👤</span>
                                            <span className="max-w-[100px] truncate">{user?.username}</span>
                                        </button>
                                    </div>

                                    {/* Admin Panel */}
                                    {isAdmin && (
                                        <button
                                            className="comic-border bg-gradient-to-r from-yellow-600/30 to-amber-600/30 border-2 border-yellow-500/50 text-yellow-300 cursor-pointer text-sm font-black px-5 py-3 rounded-xl transition-all duration-300 hover:from-yellow-600/50 hover:to-amber-600/50 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-500/30 uppercase tracking-wide transform hover:scale-105"
                                            onClick={() => onNavigate('admin')}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className="text-lg">⚙️</span>
                                                <span>Admin</span>
                                            </span>
                                        </button>
                                    )}

                                    {/* Logout */}
                                    <button
                                        className="bg-slate-900/80 border-2 border-slate-700 text-gray-400 cursor-pointer text-sm font-bold px-4 py-3 rounded-xl transition-all duration-300 hover:bg-red-600/20 hover:text-red-400 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 transform hover:scale-105"
                                        onClick={handleLogout}
                                        title="Cerrar Sesión"
                                    >
                                        <span className="text-xl">🚪</span>
                                    </button>
                                </div>

                                {/* Mobile Menu Button */}
                                <button
                                    className="lg:hidden bg-gradient-to-r from-red-600 to-orange-600 border-none text-white cursor-pointer text-lg font-black px-4 py-3 rounded-xl"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                >
                                    {isMenuOpen ? '✕' : '☰'}
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3 items-center">
                                <button
                                    className="comic-border bg-slate-900/90 border-2 border-slate-700 text-gray-300 cursor-pointer text-base font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:bg-slate-800 hover:text-white hover:border-slate-600 hover:shadow-lg transform hover:scale-105"
                                    onClick={() => onNavigate('login')}
                                >
                                    Iniciar Sesión
                                </button>
                                <button
                                    className="comic-border bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 border-none text-white cursor-pointer text-base font-black px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/50 transform hover:scale-110 uppercase tracking-wide"
                                    onClick={() => onNavigate('register')}
                                >
                                    Registrarse
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    {isAuthenticated && isMenuOpen && (
                        <div className="lg:hidden pb-4 space-y-2 animate-fade-in">
                            <button
                                className={`w-full text-left border-none cursor-pointer text-base font-bold px-6 py-3 rounded-xl transition-all duration-300 ${
                                    currentView === 'home'
                                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                                        : 'bg-slate-800/70 text-gray-300 hover:bg-slate-700'
                                }`}
                                onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}
                            >
                                🏠 Inicio
                            </button>
                            <button
                                className={`w-full text-left border-none cursor-pointer text-base font-bold px-6 py-3 rounded-xl transition-all duration-300 ${
                                    currentView === 'series-list'
                                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                                        : 'bg-slate-800/70 text-gray-300 hover:bg-slate-700'
                                }`}
                                onClick={() => { onNavigate('series-list'); setIsMenuOpen(false); }}
                            >
                                📖 Series
                            </button>
                            <button
                                className={`w-full text-left border-none cursor-pointer text-base font-bold px-6 py-3 rounded-xl transition-all duration-300 ${
                                    currentView === 'favorites'
                                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                                        : 'bg-slate-800/70 text-gray-300 hover:bg-slate-700'
                                }`}
                                onClick={() => { onNavigate('favorites'); setIsMenuOpen(false); }}
                            >
                                ❤️ Favoritos
                            </button>
                            <button
                                className={`w-full text-left border-none cursor-pointer text-base font-bold px-6 py-3 rounded-xl transition-all duration-300 ${
                                    currentView === 'history'
                                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                                        : 'bg-slate-800/70 text-gray-300 hover:bg-slate-700'
                                }`}
                                onClick={() => { onNavigate('history'); setIsMenuOpen(false); }}
                            >
                                🕐 Historial
                            </button>
                            <button
                                className="w-full text-left bg-gradient-to-r from-red-600 to-orange-600 border-none text-white cursor-pointer text-base font-black px-6 py-3 rounded-xl"
                                onClick={() => { onNavigate('upload'); setIsMenuOpen(false); }}
                            >
                                ➕ Subir Comic
                            </button>
                            <button
                                className="w-full text-left bg-slate-800/70 border-none text-gray-300 cursor-pointer text-base font-bold px-6 py-3 rounded-xl"
                                onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }}
                            >
                                👤 {user?.username}
                            </button>
                            {isAdmin && (
                                <button
                                    className="w-full text-left bg-yellow-600/30 border-2 border-yellow-500/50 text-yellow-300 cursor-pointer text-base font-black px-6 py-3 rounded-xl"
                                    onClick={() => { onNavigate('admin'); setIsMenuOpen(false); }}
                                >
                                    ⚙️ Panel Admin
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Decorative bottom stripe */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30"></div>
            </nav>
        </>
    );
}
