const { useState, useEffect } = React;

function UserProfile({ onNavigate }) {
    const [stats, setStats] = useState(null);
    const [myComics, setMyComics] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            setUser(Auth.getUser());
            const [statsData, comicsData] = await Promise.all([
                API.get(API_ENDPOINTS.USER_STATS),
                API.get(API_ENDPOINTS.COMICS_MY_UPLOADS)
            ]);
            setStats(statsData);
            setMyComics(comicsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="max-w-6xl mx-auto p-8"><div className="text-center py-12 text-xl text-gray-600">Cargando...</div></div>;

    return (
        <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Mi Perfil</h1>

            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-8 mb-8 text-center shadow-xl">
                <h2 className="text-3xl font-bold m-0 mb-2">{user?.username}</h2>
                <p className="text-lg m-0 mb-4 opacity-90">{user?.email}</p>
                <span className="inline-block bg-white/30 px-4 py-2 rounded-full text-sm font-bold">{user?.role}</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Estadísticas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-4xl font-bold text-primary-500 mb-2">{stats?.favoritos}</div>
                    <div className="text-gray-600 text-sm">Favoritos</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-4xl font-bold text-primary-500 mb-2">{stats?.votos}</div>
                    <div className="text-gray-600 text-sm">Votos</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-4xl font-bold text-primary-500 mb-2">{stats?.comicsLeidos}</div>
                    <div className="text-gray-600 text-sm">Comics Leídos</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-4xl font-bold text-primary-500 mb-2">{stats?.comicsSubidos}</div>
                    <div className="text-gray-600 text-sm">Comics Subidos</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-4xl font-bold text-primary-500 mb-2">{stats?.comicsAprobados}</div>
                    <div className="text-gray-600 text-sm">Aprobados</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-4xl font-bold text-primary-500 mb-2">{stats?.comicsPendientes}</div>
                    <div className="text-gray-600 text-sm">Pendientes</div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Mis Comics Subidos</h2>
            {myComics.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl text-gray-600">
                    No has subido ningún comic aún.
                    <button className="block mt-4 mx-auto bg-primary-500 hover:bg-primary-600 text-white border-none py-3 px-6 rounded-lg cursor-pointer text-base font-semibold transition-all duration-300 transform hover:scale-105" onClick={() => onNavigate('upload')}>
                        Subir Comic
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {myComics.map((comic) => (
                        <div key={comic.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-primary-500 text-lg font-bold mb-2">{comic.titulo}</h3>
                            <p className="text-gray-700 mb-1 text-sm"><strong>Autor:</strong> {comic.autor}</p>
                            <p className="text-gray-700 mb-1 text-sm"><strong>Estado:</strong> {comic.aprobado ? '✓ Aprobado' : '⏳ Pendiente'}</p>
                            <p className="text-gray-700 mb-1 text-sm"><strong>Votos:</strong> ❤️ {comic.totalVotos}</p>
                            <p className="text-xs text-gray-500 mt-2">{new Date(comic.fechaSubida).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
