const { useState, useEffect } = React;

function ComicList({ onNavigate }) {
    const [comics, setComics] = useState([]);
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
        <div style={styles.container}>
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
                            <div style={styles.cardHeader}>
                                <h3 style={styles.cardTitle}>{comic.titulo}</h3>
                                <span style={styles.votes}>❤️ {comic.totalVotos}</span>
                            </div>

                            <div style={styles.cardBody}>
                                <p style={styles.author}><strong>Autor:</strong> {comic.autor}</p>
                                {comic.serieId && comic.serieTitulo && (
                                    <div style={styles.serieBadge} onClick={(e) => {
                                        e.stopPropagation();
                                        onNavigate('serie-detail', { serieId: comic.serieId });
                                    }}>
                                        <span style={styles.serieIcon}>📚</span>
                                        <span>{comic.serieTitulo}</span>
                                        {comic.numeroCapitulo && <span> - Cap. {comic.numeroCapitulo}</span>}
                                    </div>
                                )}
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
    );
}

const styles = {
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
    },
    card: {
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        transition: 'transform 0.2s',
        ':hover': {
            transform: 'translateY(-5px)'
        }
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
        fontSize: '1.2rem'
    },
    votes: {
        fontSize: '1rem',
        fontWeight: 'bold'
    },
    cardBody: {
        padding: '1rem'
    },
    author: {
        marginBottom: '0.5rem',
        color: '#333'
    },
    serieBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        marginBottom: '0.75rem',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        ':hover': {
            transform: 'scale(1.05)'
        }
    },
    serieIcon: {
        marginRight: '0.3rem',
        fontSize: '1rem'
    },
    description: {
        color: '#666',
        fontSize: '0.9rem',
        marginBottom: '0.5rem',
        lineHeight: '1.4'
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
        minWidth: '80px'
    },
    secondaryButton: {
        background: '#f0f0f0',
        color: '#333'
    }
};
