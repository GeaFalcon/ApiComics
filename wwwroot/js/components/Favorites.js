const { useState, useEffect } = React;

function Favorites({ onNavigate }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const data = await API.get(API_ENDPOINTS.FAVORITES);
            setFavorites(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (comicId) => {
        try {
            await API.delete(API_ENDPOINTS.FAVORITE_REMOVE(comicId));
            loadFavorites();
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="max-w-7xl mx-auto p-8"><div className="text-center py-12 text-xl text-gray-600">Cargando...</div></div>;

    return (
        <div className="max-w-7xl mx-auto p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Mis Favoritos</h1>
            {favorites.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl text-gray-600">No tienes comics en favoritos</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map((fav) => (
                        <div key={fav.favoritoId} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-primary-500 text-xl font-bold mb-4">{fav.comic.titulo}</h3>
                            <p className="text-gray-700 mb-2"><strong>Autor:</strong> {fav.comic.autor}</p>
                            <p className="text-gray-700 mb-4"><strong>Votos:</strong> ❤️ {fav.comic.totalVotos}</p>
                            <div className="flex gap-2 mt-4">
                                <button className="flex-1 bg-primary-500 text-white border-none py-2 px-4 rounded-lg cursor-pointer transition-all duration-300 hover:bg-primary-600 font-semibold" onClick={() => onNavigate('comic-detail', { id: fav.comic.id })}>
                                    Leer
                                </button>
                                <button className="flex-1 bg-red-500 text-white border-none py-2 px-4 rounded-lg cursor-pointer transition-all duration-300 hover:bg-red-600 font-semibold" onClick={() => handleRemove(fav.comic.id)}>
                                    Quitar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
