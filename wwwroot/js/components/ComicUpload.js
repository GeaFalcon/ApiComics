const { useState } = React;

function ComicUpload({ onNavigate }) {
    const [formData, setFormData] = useState({
        titulo: '',
        autor: '',
        descripcion: ''
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        processFile(selectedFile);
    };

    const processFile = (selectedFile) => {
        if (selectedFile) {
            const allowedExtensions = ['pdf', 'cbz', 'cbr', 'jpg', 'jpeg', 'png'];
            const extension = selectedFile.name.split('.').pop().toLowerCase();

            if (!allowedExtensions.includes(extension)) {
                setError('Formato no permitido. Usa PDF, CBZ, CBR o imágenes (JPG, PNG).');
                return;
            }

            setFile(selectedFile);
            setError('');
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!file) {
            setError('Por favor selecciona un archivo');
            setLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('Titulo', formData.titulo);
            formDataToSend.append('Autor', formData.autor);
            formDataToSend.append('Descripcion', formData.descripcion);
            formDataToSend.append('Archivo', file);

            const response = await API.postFormData(API_ENDPOINTS.COMICS_UPLOAD, formDataToSend);
            setSuccess(response.mensaje || 'Comic subido correctamente. Está pendiente de aprobación.');
            setFormData({ titulo: '', autor: '', descripcion: '' });
            setFile(null);

            setTimeout(() => {
                onNavigate('profile');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Error al subir el comic');
        } finally {
            setLoading(false);
        }
    };

    const getFileIcon = (fileName) => {
        const extension = fileName?.split('.').pop().toLowerCase();
        return extension === 'pdf' ? '📄' :
               extension === 'cbz' || extension === 'cbr' ? '📚' : '🖼️';
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>📤 Subir Nuevo Comic</h1>
                <p style={styles.subtitle}>
                    Comparte tus comics favoritos con la comunidad.
                    Serán revisados por un administrador antes de ser publicados.
                </p>
            </div>

            <div style={styles.formContainer}>
                {error && (
                    <div style={styles.error}>
                        <span style={styles.errorIcon}>⚠️</span>
                        {error}
                    </div>
                )}
                {success && (
                    <div style={styles.success}>
                        <span style={styles.successIcon}>✅</span>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Drag and Drop Area */}
                    <div
                        style={{
                            ...styles.dropZone,
                            ...(dragActive ? styles.dropZoneActive : {}),
                            ...(file ? styles.dropZoneWithFile : {})
                        }}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        <input
                            id="fileInput"
                            type="file"
                            onChange={handleFileChange}
                            accept=".cbz,.cbr,.pdf,.jpg,.jpeg,.png"
                            style={styles.fileInputHidden}
                        />

                        {!file ? (
                            <>
                                <div style={styles.uploadIcon}>📁</div>
                                <p style={styles.dropZoneText}>
                                    Arrastra y suelta tu archivo aquí
                                </p>
                                <p style={styles.dropZoneSubtext}>
                                    o haz clic para seleccionar
                                </p>
                                <p style={styles.dropZoneFormats}>
                                    PDF, CBZ, CBR, JPG, PNG
                                </p>
                            </>
                        ) : (
                            <>
                                <div style={styles.filePreview}>
                                    <span style={styles.fileIcon}>{getFileIcon(file.name)}</span>
                                    <div style={styles.fileInfo}>
                                        <p style={styles.fileName}>{file.name}</p>
                                        <p style={styles.fileSize}>
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}
                                        style={styles.removeFileBtn}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <span style={styles.labelIcon}>📖</span>
                                Título *
                            </label>
                            <input
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                required
                                maxLength="200"
                                style={styles.input}
                                placeholder="Ej: Batman: The Dark Knight Returns"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <span style={styles.labelIcon}>✍️</span>
                                Autor *
                            </label>
                            <input
                                type="text"
                                name="autor"
                                value={formData.autor}
                                onChange={handleChange}
                                required
                                maxLength="100"
                                style={styles.input}
                                placeholder="Ej: Frank Miller"
                            />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            <span style={styles.labelIcon}>📝</span>
                            Descripción
                        </label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            maxLength="1000"
                            rows="4"
                            style={styles.textarea}
                            placeholder="Describe brevemente de qué trata este comic..."
                        />
                    </div>

                    <div style={styles.buttonGroup}>
                        <button
                            type="submit"
                            disabled={loading || !file}
                            style={{
                                ...styles.submitButton,
                                ...(loading || !file ? styles.submitButtonDisabled : {})
                            }}
                        >
                            {loading ? (
                                <>
                                    <span style={styles.spinner}>⏳</span>
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <span>🚀</span>
                                    Subir Comic
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => onNavigate('home')}
                            style={styles.cancelButton}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem 1rem'
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem'
    },
    title: {
        fontSize: '2.5rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '0.5rem',
        fontWeight: '800'
    },
    subtitle: {
        color: '#666',
        fontSize: '1.1rem',
        maxWidth: '600px',
        margin: '0 auto',
        lineHeight: '1.6'
    },
    formContainer: {
        background: 'white',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        border: '1px solid #f0f0f0'
    },
    error: {
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
        color: 'white',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontWeight: '500',
        boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
    },
    errorIcon: {
        fontSize: '1.5rem'
    },
    success: {
        background: 'linear-gradient(135deg, #51cf66 0%, #37b24d 100%)',
        color: 'white',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontWeight: '500',
        boxShadow: '0 4px 15px rgba(81, 207, 102, 0.3)'
    },
    successIcon: {
        fontSize: '1.5rem'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem'
    },
    dropZone: {
        border: '3px dashed #d0d0d0',
        borderRadius: '16px',
        padding: '3rem 2rem',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: '#fafafa'
    },
    dropZoneActive: {
        borderColor: '#667eea',
        background: '#f0f4ff',
        transform: 'scale(1.02)'
    },
    dropZoneWithFile: {
        borderColor: '#51cf66',
        background: '#f0fff4',
        borderStyle: 'solid'
    },
    uploadIcon: {
        fontSize: '4rem',
        marginBottom: '1rem'
    },
    dropZoneText: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#333',
        marginBottom: '0.5rem'
    },
    dropZoneSubtext: {
        color: '#666',
        fontSize: '0.95rem',
        marginBottom: '1rem'
    },
    dropZoneFormats: {
        color: '#999',
        fontSize: '0.85rem',
        fontWeight: '500'
    },
    fileInputHidden: {
        display: 'none'
    },
    filePreview: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    fileIcon: {
        fontSize: '3rem'
    },
    fileInfo: {
        flex: 1,
        textAlign: 'left'
    },
    fileName: {
        fontWeight: '600',
        color: '#333',
        marginBottom: '0.25rem',
        wordBreak: 'break-all'
    },
    fileSize: {
        color: '#666',
        fontSize: '0.9rem'
    },
    removeFileBtn: {
        background: '#ff6b6b',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        fontSize: '1.25rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    label: {
        fontWeight: '600',
        color: '#333',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    labelIcon: {
        fontSize: '1.2rem'
    },
    input: {
        padding: '0.875rem 1rem',
        border: '2px solid #e0e0e0',
        borderRadius: '10px',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        outline: 'none'
    },
    textarea: {
        padding: '0.875rem 1rem',
        border: '2px solid #e0e0e0',
        borderRadius: '10px',
        fontSize: '1rem',
        fontFamily: 'inherit',
        resize: 'vertical',
        transition: 'all 0.3s ease',
        outline: 'none'
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem'
    },
    submitButton: {
        flex: 2,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: '12px',
        fontSize: '1.1rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
    },
    submitButtonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
        transform: 'none'
    },
    cancelButton: {
        flex: 1,
        background: '#f5f5f5',
        color: '#666',
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: '12px',
        fontSize: '1.05rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    spinner: {
        display: 'inline-block',
        animation: 'spin 1s linear infinite'
    }
};
