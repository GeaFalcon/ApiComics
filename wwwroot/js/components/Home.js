const { useState, useEffect } = React;

function Home({ onNavigate }) {
    const [comics, setComics] = useState([]);
    const [topVotedComics, setTopVotedComics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadComics();
    }, []);

    const loadComics = async () => {
        try {
            setLoading(true);
            const data = await API.get(API_ENDPOINTS.COMICS);
            setComics(data);

            // Ordenar por votos para obtener los más votados
            const sortedByVotes = [...data].sort((a, b) => b.totalVotos - a.totalVotos);
            setTopVotedComics(sortedByVotes.slice(0, 10)); // Top 10 más votados
        } catch (err) {
            setError(err.message || 'Error al cargar los comics');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToFavorites = async (comicId) => {
        try {
            await API.post(API_ENDPOINTS.FAVORITE_ADD(comicId), {});
            alert('Comic agregado a favoritos');
        } catch (err) {
            alert(err.message || 'Error al agregar a favoritos');
        }
    };

    const handleVote = async (comicId) => {
        try {
            await API.post(API_ENDPOINTS.VOTE_ADD(comicId), {});
            alert('Voto registrado');
            loadComics(); // Recargar para actualizar votos
        } catch (err) {
            alert(err.message || 'Error al votar');
        }
    };

    const handleRead = async (comicId) => {
        try {
            await API.post(API_ENDPOINTS.HISTORY_ADD(comicId), {});
            onNavigate('comic-detail', { id: comicId });
        } catch (err) {
            console.error('Error al registrar lectura:', err);
            onNavigate('comic-detail', { id: comicId });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
                    <p className="mt-4 text-xl text-gray-600">Cargando comics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-8">
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <div className="max-w-[1600px] mx-auto p-4 md:p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content - 80% */}
                    <div className="flex-1 lg:w-4/5">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Comics Disponibles
                            </h1>
                            <p className="text-lg text-gray-600">
                                {comics.length} {comics.length === 1 ? 'comic aprobado' : 'comics aprobados'}
                            </p>
                        </div>

                        {comics.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                                <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <p className="text-xl text-gray-600 mb-6">No hay comics disponibles aún</p>
                                <button
                                    onClick={() => onNavigate('upload')}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Sube el primer comic
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {comics.map((comic) => (
                                    <div
                                        key={comic.id}
                                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                                    >
                                        {/* Comic Thumbnail */}
                                        {comic.rutaMiniatura && (
                                            <div className="h-56 bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
                                                <img
                                                    src={comic.rutaMiniatura}
                                                    alt={comic.titulo}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Header with Title and Votes */}
                                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-4">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-bold flex-1">{comic.titulo}</h3>
                                                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 ml-2">
                                                    <span className="text-sm font-semibold">❤️ {comic.totalVotos}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-5 flex-1 flex flex-col">
                                            <p className="text-sm text-gray-700 mb-2">
                                                <span className="font-semibold">Autor:</span> {comic.autor}
                                            </p>

                                            {comic.descripcion && (
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                                                    {comic.descripcion}
                                                </p>
                                            )}

                                            <div className="mt-auto space-y-1">
                                                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                                                        {comic.formato}
                                                    </span>
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                                        {comic.subidoPor}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(comic.fechaSubida).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Card Footer with Actions */}
                                        <div className="bg-gray-50 px-5 py-4 flex gap-2">
                                            <button
                                                onClick={() => handleRead(comic.id)}
                                                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                                            >
                                                Leer
                                            </button>
                                            <button
                                                onClick={() => handleVote(comic.id)}
                                                className="flex-1 bg-white text-gray-700 font-medium py-2 px-4 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
                                            >
                                                ❤️ Votar
                                            </button>
                                            <button
                                                onClick={() => handleAddToFavorites(comic.id)}
                                                className="flex-1 bg-white text-gray-700 font-medium py-2 px-4 rounded-lg border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-300"
                                            >
                                                ⭐
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar - 20% */}
                    <div className="lg:w-1/5 min-w-[280px]">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
                            {/* Sidebar Header */}
                            <div className="border-b-2 border-purple-600 pb-4 mb-4">
                                <div className="flex items-center justify-center space-x-2">
                                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <h2 className="text-xl font-bold text-gray-900">Más Votados</h2>
                                </div>
                            </div>

                            {/* Top Voted List */}
                            {topVotedComics.length > 0 ? (
                                <div className="space-y-3">
                                    {topVotedComics.map((comic, index) => (
                                        <div
                                            key={comic.id}
                                            onClick={() => handleRead(comic.id)}
                                            className="flex gap-3 p-3 bg-gradient-to-br from-gray-50 to-purple-50 rounded-lg cursor-pointer hover:from-purple-100 hover:to-blue-100 transition-all duration-300 border border-transparent hover:border-purple-300 group"
                                        >
                                            {/* Rank Badge */}
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                                <div className={`
                                                    text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center
                                                    ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                                                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                                                      index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                                                      'bg-purple-200 text-purple-700'}
                                                `}>
                                                    {index + 1}
                                                </div>
                                            </div>

                                            {/* Thumbnail */}
                                            {comic.rutaMiniatura && (
                                                <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-200 shadow-sm">
                                                    <img
                                                        src={comic.rutaMiniatura}
                                                        alt={comic.titulo}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* Comic Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-purple-700 transition-colors">
                                                    {comic.titulo}
                                                </h4>
                                                <p className="text-xs text-gray-600 truncate">
                                                    {comic.autor}
                                                </p>
                                                <div className="flex items-center mt-1">
                                                    <span className="text-xs font-semibold text-purple-600">
                                                        ❤️ {comic.totalVotos}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    <p className="text-sm text-gray-500">No hay comics votados aún</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
