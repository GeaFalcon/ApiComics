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
            <div style={styles.container}>
                <div style={styles.loading}>Cargando comics...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <div style={styles.homeContainer}>
            {/* Main Content - 80% */}
            <div style={styles.mainContent}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Comics Disponibles</h1>
                    <p style={styles.subtitle}>{comics.length} comics aprobados</p>
                </div>

                {comics.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p>No hay comics disponibles aún.</p>
                        <button style={styles.uploadButton} onClick={() => onNavigate('upload')}>
                            Sube el primer comic
                        </button>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {comics.map((comic) => (
                            <div key={comic.id} style={styles.card}>
                                {comic.rutaMiniatura && (
                                    <div style={styles.cardImage}>
                                        <img
                                            src={comic.rutaMiniatura}
                                            alt={comic.titulo}
                                            style={styles.thumbnail}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}

                                <div style={styles.cardHeader}>
                                    <h3 style={styles.cardTitle}>{comic.titulo}</h3>
                                    <span style={styles.votes}>❤️ {comic.totalVotos}</span>
                                </div>

                                <div style={styles.cardBody}>
                                    <p style={styles.author}><strong>Autor:</strong> {comic.autor}</p>
                                    {comic.descripcion && (
                                        <p style={styles.description}>{comic.descripcion}</p>
                                    )}
                                    <p style={styles.meta}>
                                        <span>Formato: {comic.formato}</span>
                                        <span>Subido por: {comic.subidoPor}</span>
                                    </p>
                                    <p style={styles.date}>
                                        {new Date(comic.fechaSubida).toLocaleDateString()}
                                    </p>
                                </div>

                                <div style={styles.cardFooter}>
                                    <button
                                        style={styles.actionButton}
                                        onClick={() => handleRead(comic.id)}
                                    >
                                        Leer
                                    </button>
                                    <button
                                        style={{...styles.actionButton, ...styles.secondaryButton}}
                                        onClick={() => handleVote(comic.id)}
                                    >
                                        ❤️ Votar
                                    </button>
                                    <button
                                        style={{...styles.actionButton, ...styles.secondaryButton}}
                                        onClick={() => handleAddToFavorites(comic.id)}
                                    >
                                        ⭐ Favorito
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sidebar - 20% */}
            <div style={styles.sidebar}>
                <div style={styles.sidebarHeader}>
                    <h2 style={styles.sidebarTitle}>Más Votados</h2>
                </div>

                {topVotedComics.length > 0 ? (
                    <div style={styles.topVotedList}>
                        {topVotedComics.map((comic, index) => (
                            <div
                                key={comic.id}
                                style={styles.topVotedItem}
                                onClick={() => handleRead(comic.id)}
                            >
                                <div style={styles.topVotedRank}>#{index + 1}</div>

                                {comic.rutaMiniatura && (
                                    <div style={styles.topVotedThumbnailContainer}>
                                        <img
                                            src={comic.rutaMiniatura}
                                            alt={comic.titulo}
                                            style={styles.topVotedThumbnail}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}

                                <div style={styles.topVotedInfo}>
                                    <h4 style={styles.topVotedTitle}>{comic.titulo}</h4>
                                    <p style={styles.topVotedAuthor}>{comic.autor}</p>
                                    <p style={styles.topVotedVotes}>❤️ {comic.totalVotos} votos</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={styles.sidebarEmpty}>
                        <p>No hay comics votados aún</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    homeContainer: {
        display: 'flex',
        gap: '1.5rem',
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '2rem',
        minHeight: 'calc(100vh - 200px)'
    },
    mainContent: {
        flex: '0 0 78%',
        minWidth: 0
    },
    sidebar: {
        flex: '0 0 20%',
        minWidth: '250px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '1.5rem',
        position: 'sticky',
        top: '20px',
        height: 'fit-content',
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto'
    },
    sidebarHeader: {
        borderBottom: '2px solid #667eea',
        paddingBottom: '1rem',
        marginBottom: '1rem'
    },
    sidebarTitle: {
        fontSize: '1.3rem',
        color: '#333',
        margin: 0,
        textAlign: 'center'
    },
    topVotedList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    topVotedItem: {
        display: 'flex',
        gap: '0.75rem',
        padding: '0.75rem',
        background: '#f9f9f9',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: '1px solid transparent',
        ':hover': {
            background: '#f0f0f0',
            border: '1px solid #667eea',
            transform: 'translateX(5px)'
        }
    },
    topVotedRank: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#667eea',
        minWidth: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    topVotedThumbnailContainer: {
        flex: '0 0 60px',
        height: '60px',
        borderRadius: '5px',
        overflow: 'hidden',
        background: '#e0e0e0'
    },
    topVotedThumbnail: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    topVotedInfo: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    topVotedTitle: {
        margin: '0 0 0.25rem 0',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        color: '#333',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    topVotedAuthor: {
        margin: '0 0 0.25rem 0',
        fontSize: '0.75rem',
        color: '#666',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    topVotedVotes: {
        margin: 0,
        fontSize: '0.8rem',
        color: '#667eea',
        fontWeight: 'bold'
    },
    sidebarEmpty: {
        textAlign: 'center',
        padding: '2rem 1rem',
        color: '#999',
        fontSize: '0.9rem'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
    },
    header: {
        marginBottom: '2rem'
    },
    title: {
        fontSize: '2rem',
        color: '#333',
        marginBottom: '0.5rem'
    },
    subtitle: {
        color: '#666',
        fontSize: '1.1rem'
    },
    loading: {
        textAlign: 'center',
        padding: '3rem',
        fontSize: '1.2rem',
        color: '#666'
    },
    error: {
        background: '#fee',
        color: '#c33',
        padding: '1rem',
        borderRadius: '5px',
        textAlign: 'center'
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem',
        background: '#f9f9f9',
        borderRadius: '10px'
    },
    uploadButton: {
        marginTop: '1rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
    },
    card: {
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        transition: 'transform 0.2s',
        display: 'flex',
        flexDirection: 'column'
    },
    cardImage: {
        width: '100%',
        height: '200px',
        background: '#f0f0f0',
        overflow: 'hidden'
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    cardHeader: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardTitle: {
        margin: 0,
        fontSize: '1.1rem'
    },
    votes: {
        fontSize: '1rem',
        fontWeight: 'bold'
    },
    cardBody: {
        padding: '1rem',
        flex: 1
    },
    author: {
        marginBottom: '0.5rem',
        color: '#333'
    },
    description: {
        color: '#666',
        fontSize: '0.9rem',
        marginBottom: '0.5rem',
        lineHeight: '1.4',
        display: '-webkit-box',
        WebkitLineClamp: '3',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    },
    meta: {
        fontSize: '0.85rem',
        color: '#888',
        marginTop: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
    },
    date: {
        fontSize: '0.8rem',
        color: '#999',
        marginTop: '0.5rem'
    },
    cardFooter: {
        padding: '1rem',
        background: '#f9f9f9',
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
    },
    actionButton: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        flex: 1,
        minWidth: '80px',
        transition: 'opacity 0.2s',
        ':hover': {
            opacity: 0.9
        }
    },
    secondaryButton: {
        background: '#f0f0f0',
        color: '#333'
    }
};
