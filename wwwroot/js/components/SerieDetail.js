const { useState, useEffect } = React;

function SerieDetail({ serieId, onNavigate }) {
    const [serie, setSerie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSerieDetails();
    }, [serieId]);

    const loadSerieDetails = async () => {
        try {
            setLoading(true);
            const data = await API.get(`/api/series/${serieId}`);
            setSerie(data);
        } catch (err) {
            setError(err.message || 'Error al cargar los detalles de la serie');
        } finally {
            setLoading(false);
        }
    };

    const handleReadChapter = async (comicId) => {
        try {
            await API.post(API_ENDPOINTS.HISTORY_ADD(comicId), {});
            onNavigate('comic-detail', { id: comicId });
        } catch (err) {
            console.error('Error al registrar lectura:', err);
            onNavigate('comic-detail', { id: comicId });
        }
    };

    const handleVoteChapter = async (comicId) => {
        try {
            await API.post(API_ENDPOINTS.VOTE_ADD(comicId), {});
            alert('Voto registrado');
            loadSerieDetails(); // Recargar para actualizar votos
        } catch (err) {
            alert(err.message || 'Error al votar');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">Cargando serie...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
                <button
                    onClick={() => onNavigate('series-list')}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                    Volver a Series
                </button>
            </div>
        );
    }

    if (!serie) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-gray-600">Serie no encontrada</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Botón de volver */}
            <button
                onClick={() => onNavigate('series-list')}
                className="mb-6 flex items-center text-purple-600 hover:text-purple-800"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a Series
            </button>

            {/* Header de la serie */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="md:flex">
                    {/* Portada */}
                    <div className="md:w-1/3 lg:w-1/4">
                        {serie.RutaPortada ? (
                            <img
                                src={serie.RutaPortada}
                                alt={serie.Titulo}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="bg-gradient-to-br from-purple-400 to-purple-600 h-96 flex items-center justify-center">
                                <svg className="w-32 h-32 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Información de la serie */}
                    <div className="md:w-2/3 lg:w-3/4 p-6 md:p-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {serie.Titulo}
                        </h1>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                {serie.Autor}
                            </span>
                            {serie.Genero && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {serie.Genero}
                                </span>
                            )}
                            {serie.Estado && (
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    serie.Estado === 'Finalizada' ? 'bg-green-100 text-green-800' :
                                    serie.Estado === 'En curso' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {serie.Estado}
                                </span>
                            )}
                            {serie.AnoPublicacion && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                    {serie.AnoPublicacion}
                                </span>
                            )}
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700 text-lg leading-relaxed">
                                {serie.Descripcion || 'Sin descripción disponible'}
                            </p>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                                <span className="font-semibold">{serie.TotalCapitulos}</span> capítulos
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                </svg>
                                <span className="font-semibold">{serie.TotalVotos}</span> votos totales
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de capítulos */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Capítulos ({serie.Capitulos?.length || 0})
                </h2>

                {serie.Capitulos && serie.Capitulos.length > 0 ? (
                    <div className="grid gap-4">
                        {serie.Capitulos.map((capitulo) => (
                            <div
                                key={capitulo.Id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Miniatura */}
                                    <div className="md:w-40 h-48 md:h-auto flex-shrink-0">
                                        {capitulo.RutaMiniatura ? (
                                            <img
                                                src={capitulo.RutaMiniatura}
                                                alt={capitulo.TituloCapitulo || capitulo.Titulo}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center">
                                                <svg className="w-12 h-12 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Información del capítulo */}
                                    <div className="flex-1 p-4 md:p-6">
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                                            <div className="flex-1 mb-4 md:mb-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {capitulo.NumeroVolumen && (
                                                        <span className="text-sm font-semibold text-purple-600">
                                                            Vol. {capitulo.NumeroVolumen}
                                                        </span>
                                                    )}
                                                    {capitulo.NumeroCapitulo && (
                                                        <span className="text-sm font-semibold text-purple-600">
                                                            Cap. {capitulo.NumeroCapitulo}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-gray-500">
                                                        {capitulo.Formato}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {capitulo.TituloCapitulo || capitulo.Titulo}
                                                </h3>

                                                {capitulo.Descripcion && (
                                                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                                        {capitulo.Descripcion}
                                                    </p>
                                                )}

                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span>Por {capitulo.SubidoPor}</span>
                                                    <span>•</span>
                                                    <span>{new Date(capitulo.FechaSubida).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                                        </svg>
                                                        {capitulo.TotalVotos}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Botones de acción */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleReadChapter(capitulo.Id)}
                                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Leer
                                                </button>
                                                <button
                                                    onClick={() => handleVoteChapter(capitulo.Id)}
                                                    className="bg-white border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay capítulos disponibles</h3>
                        <p className="text-gray-600">Esta serie aún no tiene capítulos publicados.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
