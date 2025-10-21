const { useState, useEffect } = React;

function ComicDetail({ comicId, onNavigate }) {
    const [comic, setComic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadComic();
    }, [comicId]);

    const loadComic = async () => {
        try {
            const data = await API.get(API_ENDPOINTS.COMIC_BY_ID(comicId));
            setComic(data);
        } catch (err) {
            setError(err.message || 'Error al cargar el comic');
        } finally {
            setLoading(false);
        }
    };

    const handleView = () => {
        window.open(API_ENDPOINTS.COMIC_VIEW(comicId), '_blank');
    };

    const handleDownload = () => {
        window.open(API_ENDPOINTS.COMIC_DOWNLOAD(comicId), '_blank');
    };

    if (loading) return <div style={styles.container}><div style={styles.loading}>Cargando...</div></div>;
    if (error) return <div style={styles.container}><div style={styles.error}>{error}</div></div>;
    if (!comic) return null;

    return (
        <div style={styles.container}>
            <button style={styles.backButton} onClick={() => onNavigate('home')}>
                ← Volver
            </button>

            <div style={styles.detailCard}>
                <h1 style={styles.title}>{comic.titulo}</h1>

                <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                        <strong>Autor:</strong> {comic.autor}
                    </div>
                    <div style={styles.infoItem}>
                        <strong>Formato:</strong> {comic.formato}
                    </div>
                    <div style={styles.infoItem}>
                        <strong>Subido por:</strong> {comic.subidoPor}
                    </div>
                    <div style={styles.infoItem}>
                        <strong>Votos:</strong> ❤️ {comic.totalVotos}
                    </div>
                    <div style={styles.infoItem}>
                        <strong>Fecha:</strong> {new Date(comic.fechaSubida).toLocaleDateString()}
                    </div>
                </div>

                {comic.descripcion && (
                    <div style={styles.description}>
                        <h3>Descripción</h3>
                        <p>{comic.descripcion}</p>
                    </div>
                )}

                <div style={styles.actions}>
                    <button style={styles.viewButton} onClick={handleView}>
                        📖 Ver Comic
                    </button>
                    <button style={styles.downloadButton} onClick={handleDownload}>
                        💾 Descargar
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
    loading: { textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#666' },
    error: { background: '#fee', color: '#c33', padding: '1rem', borderRadius: '5px', textAlign: 'center' },
    backButton: { background: '#f0f0f0', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '1rem' },
    detailCard: { background: 'white', borderRadius: '10px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    title: { color: '#667eea', fontSize: '2.5rem', marginBottom: '1.5rem' },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
    infoItem: { padding: '0.75rem', background: '#f9f9f9', borderRadius: '5px' },
    description: { marginBottom: '2rem', padding: '1rem', background: '#f9f9f9', borderRadius: '5px' },
    actions: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
    viewButton: { flex: 1, minWidth: '200px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '1rem', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' },
    downloadButton: { flex: 1, minWidth: '200px', background: '#4CAF50', color: 'white', border: 'none', padding: '1rem', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }
};
