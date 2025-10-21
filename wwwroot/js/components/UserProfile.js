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

    if (loading) return <div style={styles.container}><div style={styles.loading}>Cargando...</div></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Mi Perfil</h1>

            <div style={styles.userCard}>
                <h2 style={styles.username}>{user?.username}</h2>
                <p style={styles.email}>{user?.email}</p>
                <span style={styles.role}>{user?.role}</span>
            </div>

            <h2 style={styles.subtitle}>Estadísticas</h2>
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats?.favoritos}</div>
                    <div style={styles.statLabel}>Favoritos</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats?.votos}</div>
                    <div style={styles.statLabel}>Votos</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats?.comicsLeidos}</div>
                    <div style={styles.statLabel}>Comics Leídos</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats?.comicsSubidos}</div>
                    <div style={styles.statLabel}>Comics Subidos</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats?.comicsAprobados}</div>
                    <div style={styles.statLabel}>Aprobados</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats?.comicsPendientes}</div>
                    <div style={styles.statLabel}>Pendientes</div>
                </div>
            </div>

            <h2 style={styles.subtitle}>Mis Comics Subidos</h2>
            {myComics.length === 0 ? (
                <div style={styles.emptyState}>
                    No has subido ningún comic aún.
                    <button style={styles.uploadButton} onClick={() => onNavigate('upload')}>
                        Subir Comic
                    </button>
                </div>
            ) : (
                <div style={styles.comicsList}>
                    {myComics.map((comic) => (
                        <div key={comic.id} style={styles.comicCard}>
                            <h3 style={styles.comicTitle}>{comic.titulo}</h3>
                            <p><strong>Autor:</strong> {comic.autor}</p>
                            <p><strong>Estado:</strong> {comic.aprobado ? '✓ Aprobado' : '⏳ Pendiente'}</p>
                            <p><strong>Votos:</strong> ❤️ {comic.totalVotos}</p>
                            <p style={styles.date}>{new Date(comic.fechaSubida).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' },
    title: { fontSize: '2rem', color: '#333', marginBottom: '2rem' },
    subtitle: { fontSize: '1.5rem', color: '#333', marginTop: '2rem', marginBottom: '1rem' },
    loading: { textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#666' },
    userCard: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '10px', padding: '2rem', marginBottom: '2rem', textAlign: 'center' },
    username: { fontSize: '2rem', margin: '0 0 0.5rem 0' },
    email: { fontSize: '1.1rem', margin: '0 0 1rem 0', opacity: 0.9 },
    role: { background: 'rgba(255,255,255,0.3)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' },
    statCard: { background: 'white', borderRadius: '10px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    statNumber: { fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea', marginBottom: '0.5rem' },
    statLabel: { color: '#666', fontSize: '0.9rem' },
    emptyState: { textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '10px', color: '#666' },
    uploadButton: { marginTop: '1rem', background: '#667eea', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' },
    comicsList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' },
    comicCard: { background: 'white', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    comicTitle: { color: '#667eea', marginBottom: '0.5rem' },
    date: { fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }
};
