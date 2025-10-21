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

    if (loading) return <div style={styles.container}><div style={styles.loading}>Cargando...</div></div>;
    if (error) return <div style={styles.container}><div style={styles.error}>{error}</div></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Panel de Administración</h1>
            <p style={styles.subtitle}>{pendingComics.length} comics pendientes de aprobación</p>

            {pendingComics.length === 0 ? (
                <div style={styles.emptyState}>No hay comics pendientes de aprobación</div>
            ) : (
                <div style={styles.list}>
                    {pendingComics.map((comic) => (
                        <div key={comic.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.cardTitle}>{comic.titulo}</h3>
                            </div>
                            <div style={styles.cardBody}>
                                <p><strong>Autor:</strong> {comic.autor}</p>
                                {comic.descripcion && <p>{comic.descripcion}</p>}
                                <p><strong>Formato:</strong> {comic.formato}</p>
                                <p><strong>Subido por:</strong> {comic.subidoPor}</p>
                                <p style={styles.date}>{new Date(comic.fechaSubida).toLocaleString()}</p>
                            </div>
                            <div style={styles.cardFooter}>
                                <button style={styles.approveButton} onClick={() => handleApprove(comic.id)}>
                                    ✓ Aprobar
                                </button>
                                <button style={styles.rejectButton} onClick={() => handleReject(comic.id)}>
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

const styles = {
    container: { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
    title: { fontSize: '2rem', color: '#333', marginBottom: '0.5rem' },
    subtitle: { color: '#666', fontSize: '1.1rem', marginBottom: '2rem' },
    loading: { textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#666' },
    error: { background: '#fee', color: '#c33', padding: '1rem', borderRadius: '5px' },
    emptyState: { textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '10px', color: '#666' },
    list: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    card: { background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden' },
    cardHeader: { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '1rem' },
    cardTitle: { margin: 0, fontSize: '1.3rem' },
    cardBody: { padding: '1rem' },
    date: { fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' },
    cardFooter: { padding: '1rem', background: '#f9f9f9', display: 'flex', gap: '1rem' },
    approveButton: { flex: 1, background: '#4CAF50', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
    rejectButton: { flex: 1, background: '#f44336', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }
};
