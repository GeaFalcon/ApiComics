const { useState, useEffect } = React;

function SeriesList({ onNavigate }) {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSeries();
    }, []);

    const loadSeries = async () => {
        try {
            setLoading(true);
            const data = await API.get('/api/series');
            setSeries(data);
        } catch (err) {
            setError(err.message || 'Error al cargar las series');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">Cargando series...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Series de Comics</h1>
                <p className="text-gray-600">
                    Explora todas las series disponibles y sus capítulos
                </p>
            </div>

            {series.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay series disponibles</h3>
                    <p className="text-gray-600">Aún no se han creado series en la plataforma.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {series.map((serie) => (
                        <div
                            key={serie.Id}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer transform hover:scale-105 transition-transform"
                            onClick={() => onNavigate('serie-detail', { serieId: serie.Id })}
                        >
                            {/* Portada */}
                            <div className="relative h-80 overflow-hidden">
                                {serie.RutaPortada ? (
                                    <img
                                        src={serie.RutaPortada}
                                        alt={serie.Titulo}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                                        <svg className="w-24 h-24 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                        </svg>
                                    </div>
                                )}

                                {/* Badge de estado */}
                                {serie.Estado && (
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            serie.Estado === 'Finalizada' ? 'bg-green-500 text-white' :
                                            serie.Estado === 'En curso' ? 'bg-yellow-500 text-white' :
                                            'bg-gray-500 text-white'
                                        }`}>
                                            {serie.Estado}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Información */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                                    {serie.Titulo}
                                </h3>

                                <p className="text-sm text-gray-600 mb-3">
                                    Por {serie.Autor}
                                </p>

                                {serie.Descripcion && (
                                    <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                                        {serie.Descripcion}
                                    </p>
                                )}

                                {/* Género y año */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {serie.Genero && (
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                            {serie.Genero}
                                        </span>
                                    )}
                                    {serie.AnoPublicacion && (
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                                            {serie.AnoPublicacion}
                                        </span>
                                    )}
                                </div>

                                {/* Estadísticas */}
                                <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-3">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                        </svg>
                                        <span className="font-semibold">{serie.TotalCapitulos}</span>
                                        <span className="ml-1">cap.</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                        </svg>
                                        <span className="font-semibold">{serie.TotalVotos}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
