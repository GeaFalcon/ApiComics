const { useState, useEffect } = React;

function AdminPanel() {
    const [pendingComics, setPendingComics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadPendingComics();
    }, []);

    const loadPendingComics = async () => {
        try {
            setLoading(true);
            const data = await API.get(API_ENDPOINTS.COMICS_PENDING);
            setPendingComics(data);
        } catch (err) {
            setError(err.message || 'Error al cargar comics pendientes');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!confirm('¿Aprobar este comic?')) return;

        try {
            await API.put(API_ENDPOINTS.COMIC_APPROVE(id));
            alert('Comic aprobado correctamente');
            loadPendingComics();
        } catch (err) {
            alert(err.message || 'Error al aprobar el comic');
        }
    };

    const handleReject = async (id) => {
        if (!confirm('¿Rechazar y eliminar este comic?')) return;

        try {
            await API.delete(API_ENDPOINTS.COMIC_REJECT(id));
            alert('Comic rechazado');
            loadPendingComics();
        } catch (err) {
            alert(err.message || 'Error al rechazar el comic');
        }
    };

    if (loading) return <div className="max-w-5xl mx-auto p-8"><div className="text-center py-12 text-xl text-gray-600">Cargando...</div></div>;
    if (error) return <div className="max-w-5xl mx-auto p-8"><div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div></div>;

    return (
        <div className="max-w-5xl mx-auto p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Panel de Administración</h1>
            <p className="text-gray-600 text-lg mb-8">{pendingComics.length} comics pendientes de aprobación</p>

            {pendingComics.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl text-gray-600">No hay comics pendientes de aprobación</div>
            ) : (
                <div className="flex flex-col gap-6">
                    {pendingComics.map((comic) => (
                        <div key={comic.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                            <div className="bg-gradient-to-r from-pink-400 to-red-500 text-white p-6">
                                <h3 className="text-2xl font-bold m-0">{comic.titulo}</h3>
                            </div>
                            <div className="p-6">
                                <p className="mb-2 text-gray-700"><strong>Autor:</strong> {comic.autor}</p>
                                {comic.descripcion && <p className="mb-2 text-gray-700">{comic.descripcion}</p>}
                                <p className="mb-2 text-gray-700"><strong>Formato:</strong> {comic.formato}</p>
                                <p className="mb-2 text-gray-700"><strong>Subido por:</strong> {comic.subidoPor}</p>
                                <p className="text-sm text-gray-500 mt-2">{new Date(comic.fechaSubida).toLocaleString()}</p>
                            </div>
                            <div className="p-4 bg-gray-50 flex gap-4">
                                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white border-none py-3 px-6 rounded-lg cursor-pointer text-base font-bold transition-all duration-300 transform hover:scale-105" onClick={() => handleApprove(comic.id)}>
                                    ✓ Aprobar
                                </button>
                                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white border-none py-3 px-6 rounded-lg cursor-pointer text-base font-bold transition-all duration-300 transform hover:scale-105" onClick={() => handleReject(comic.id)}>
                                    ✗ Rechazar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
