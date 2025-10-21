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

    if (loading) return <div style={styles.container}><div style={styles.loading}>Cargando...</div></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Mis Favoritos</h1>
            {favorites.length === 0 ? (
                <div style={styles.emptyState}>No tienes comics en favoritos</div>
            ) : (
                <div style={styles.grid}>
                    {favorites.map((fav) => (
                        <div key={fav.favoritoId} style={styles.card}>
                            <h3 style={styles.cardTitle}>{fav.comic.titulo}</h3>
                            <p><strong>Autor:</strong> {fav.comic.autor}</p>
                            <p><strong>Votos:</strong> ❤️ {fav.comic.totalVotos}</p>
                            <div style={styles.cardFooter}>
                                <button style={styles.readButton} onClick={() => onNavigate('comic-detail', { id: fav.comic.id })}>
                                    Leer
                                </button>
                                <button style={styles.removeButton} onClick={() => handleRemove(fav.comic.id)}>
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

const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    title: { fontSize: '2rem', color: '#333', marginBottom: '2rem' },
    loading: { textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#666' },
    emptyState: { textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '10px', color: '#666' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
    card: { background: 'white', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    cardTitle: { color: '#667eea', marginBottom: '1rem' },
    cardFooter: { display: 'flex', gap: '0.5rem', marginTop: '1rem' },
    readButton: { flex: 1, background: '#667eea', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '5px', cursor: 'pointer' },
    removeButton: { flex: 1, background: '#f44336', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '5px', cursor: 'pointer' }
};
