const { useState, useEffect, useRef } = React;

function ComicViewer({ comicId, onNavigate }) {
    const [comic, setComic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pdfDoc, setPdfDoc] = useState(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        loadComic();
    }, [comicId]);

    useEffect(() => {
        if (pdfDoc && currentPage) {
            renderPage(currentPage);
        }
    }, [pdfDoc, currentPage]);

    const loadComic = async () => {
        try {
            const data = await API.get(API_ENDPOINTS.COMIC_BY_ID(comicId));
            setComic(data);

            if (data.formato === 'PDF') {
                await loadPDF(comicId);
            }
        } catch (err) {
            setError(err.message || 'Error al cargar el comic');
        } finally {
            setLoading(false);
        }
    };

    const loadPDF = async (id) => {
        try {
            const token = Auth.getToken();
            const url = `${API_ENDPOINTS.COMIC_VIEW(id)}?token=${token}`;

            // Fetch the PDF with authentication
            const response = await fetch(url, {
                headers: Auth.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Error al cargar el PDF');
            }

            const arrayBuffer = await response.arrayBuffer();

            // Load PDF using PDF.js
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            setPdfDoc(pdf);
            setTotalPages(pdf.numPages);
            setCurrentPage(1);
        } catch (err) {
            console.error('Error loading PDF:', err);
            setError('Error al cargar el PDF: ' + err.message);
        }
    };

    const renderPage = async (pageNum) => {
        if (!pdfDoc || !canvasRef.current) return;

        try {
            const page = await pdfDoc.getPage(pageNum);
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Calculate scale to fit container
            const container = canvas.parentElement;
            const containerWidth = container.offsetWidth;
            const viewport = page.getViewport({ scale: 1 });
            const scale = (containerWidth - 40) / viewport.width; // 40px for padding
            const scaledViewport = page.getViewport({ scale });

            canvas.height = scaledViewport.height;
            canvas.width = scaledViewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: scaledViewport
            };

            await page.render(renderContext).promise;
        } catch (err) {
            console.error('Error rendering page:', err);
            setError('Error al renderizar la página');
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>Cargando comic...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>
                    <h3>Error</h3>
                    <p>{error}</p>
                    <button style={styles.backButton} onClick={() => onNavigate('home')}>
                        ← Volver
                    </button>
                </div>
            </div>
        );
    }

    if (!comic) return null;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.backButton} onClick={() => onNavigate('comic-detail', { id: comicId })}>
                    ← Volver al detalle
                </button>
                <h2 style={styles.title}>{comic.titulo}</h2>
                {totalPages > 0 && (
                    <div style={styles.pageInfo}>
                        Página {currentPage} de {totalPages}
                    </div>
                )}
            </div>

            <div style={styles.viewerContainer}>
                {comic.formato === 'PDF' ? (
                    <div style={styles.pdfViewer}>
                        <canvas ref={canvasRef} style={styles.canvas}></canvas>
                    </div>
                ) : (
                    <div style={styles.notSupported}>
                        <p>Formato no soportado para visualización en línea.</p>
                        <p>Puedes descargar el archivo para verlo.</p>
                        <button
                            style={styles.downloadButton}
                            onClick={() => window.open(API_ENDPOINTS.COMIC_DOWNLOAD(comicId), '_blank')}
                        >
                            💾 Descargar
                        </button>
                    </div>
                )}
            </div>

            {totalPages > 0 && (
                <div style={styles.controls}>
                    <button
                        style={{...styles.controlButton, ...(currentPage === 1 ? styles.controlButtonDisabled : {})}}
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                    >
                        ← Anterior
                    </button>
                    <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={currentPage}
                        onChange={(e) => {
                            const page = parseInt(e.target.value);
                            if (page >= 1 && page <= totalPages) {
                                setCurrentPage(page);
                            }
                        }}
                        style={styles.pageInput}
                    />
                    <button
                        style={{...styles.controlButton, ...(currentPage === totalPages ? styles.controlButtonDisabled : {})}}
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente →
                    </button>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1rem',
        minHeight: '100vh'
    },
    header: {
        background: 'white',
        padding: '1rem',
        borderRadius: '10px',
        marginBottom: '1rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
    },
    backButton: {
        background: '#f0f0f0',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'all 0.2s'
    },
    title: {
        margin: 0,
        color: '#667eea',
        fontSize: '1.5rem',
        flex: 1,
        textAlign: 'center'
    },
    pageInfo: {
        fontSize: '1rem',
        color: '#666',
        fontWeight: '600'
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
        padding: '2rem',
        borderRadius: '10px',
        textAlign: 'center'
    },
    viewerContainer: {
        background: '#2a2a2a',
        borderRadius: '10px',
        padding: '1rem',
        minHeight: '70vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    },
    pdfViewer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    canvas: {
        maxWidth: '100%',
        height: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    },
    notSupported: {
        textAlign: 'center',
        color: 'white',
        padding: '2rem'
    },
    downloadButton: {
        marginTop: '1rem',
        background: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1.1rem',
        fontWeight: 'bold'
    },
    controls: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '1rem',
        background: 'white',
        padding: '1rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    controlButton: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        transition: 'all 0.2s'
    },
    controlButtonDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed'
    },
    pageInput: {
        width: '80px',
        padding: '0.5rem',
        fontSize: '1rem',
        textAlign: 'center',
        border: '2px solid #667eea',
        borderRadius: '5px'
    }
};
