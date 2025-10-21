const { useState, useEffect } = React;

function ReadingHistory({ onNavigate }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const data = await API.get(API_ENDPOINTS.HISTORY);
            setHistory(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={styles.container}><div style={styles.loading}>Cargando...</div></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Historial de Lectura</h1>
            {history.length === 0 ? (
                <div style={styles.emptyState}>No has leído ningún comic aún</div>
            ) : (
                <div style={styles.list}>
                    {history.map((item) => (
                        <div key={item.historialId} style={styles.card}>
                            <h3 style={styles.cardTitle}>{item.comic.titulo}</h3>
                            <p><strong>Autor:</strong> {item.comic.autor}</p>
                            <p><strong>Última lectura:</strong> {new Date(item.fechaLectura).toLocaleString()}</p>
                            <button style={styles.continueButton} onClick={() => onNavigate('comic-detail', { id: item.comic.id })}>
                                Continuar leyendo
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
    title: { fontSize: '2rem', color: '#333', marginBottom: '2rem' },
    loading: { textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#666' },
    emptyState: { textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '10px', color: '#666' },
    list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    card: { background: 'white', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    cardTitle: { color: '#667eea', marginBottom: '0.5rem' },
    continueButton: { marginTop: '1rem', background: '#667eea', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }
};
