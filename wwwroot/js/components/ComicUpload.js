const { useState } = React;

function ComicUpload({ onNavigate }) {
    const [formData, setFormData] = useState({
        titulo: '',
        autor: '',
        descripcion: '',
        formato: 'CBZ'
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError('');
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
            formDataToSend.append('titulo', formData.titulo);
            formDataToSend.append('autor', formData.autor);
            formDataToSend.append('descripcion', formData.descripcion);
            formDataToSend.append('formato', formData.formato);
            formDataToSend.append('archivo', file);

            const response = await API.postFormData(API_ENDPOINTS.COMICS_UPLOAD, formDataToSend);
            setSuccess(response.mensaje || 'Comic subido correctamente. Está pendiente de aprobación.');
            setFormData({ titulo: '', autor: '', descripcion: '', formato: 'CBZ' });
            setFile(null);
            document.getElementById('fileInput').value = '';

            setTimeout(() => {
                onNavigate('profile');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Error al subir el comic');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Subir Nuevo Comic</h2>
                <p style={styles.subtitle}>
                    Los comics subidos serán revisados por un administrador antes de ser publicados.
                </p>

                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Título *</label>
                        <input
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                            maxLength="200"
                            style={styles.input}
                            placeholder="Ingresa el título del comic"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Autor *</label>
                        <input
                            type="text"
                            name="autor"
                            value={formData.autor}
                            onChange={handleChange}
                            required
                            maxLength="100"
                            style={styles.input}
                            placeholder="Nombre del autor"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Descripción</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            maxLength="1000"
                            rows="4"
                            style={styles.textarea}
                            placeholder="Descripción del comic (opcional)"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Formato *</label>
                        <select
                            name="formato"
                            value={formData.formato}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        >
                            <option value="CBZ">CBZ</option>
                            <option value="CBR">CBR</option>
                            <option value="PDF">PDF</option>
                            <option value="JPG">JPG/JPEG</option>
                            <option value="PNG">PNG</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Archivo del Comic *</label>
                        <input
                            id="fileInput"
                            type="file"
                            onChange={handleFileChange}
                            required
                            accept=".cbz,.cbr,.pdf,.jpg,.jpeg,.png"
                            style={styles.fileInput}
                        />
                        {file && (
                            <p style={styles.fileName}>
                                Archivo seleccionado: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        )}
                    </div>

                    <div style={styles.buttonGroup}>
                        <button type="submit" disabled={loading} style={styles.submitButton}>
                            {loading ? 'Subiendo...' : 'Subir Comic'}
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
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem'
    },
    formContainer: {
        background: 'white',
        borderRadius: '10px',
        padding: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    title: {
        fontSize: '2rem',
        color: '#333',
        marginBottom: '0.5rem'
    },
    subtitle: {
        color: '#666',
        fontSize: '0.95rem',
        marginBottom: '1.5rem'
    },
    error: {
        background: '#fee',
        color: '#c33',
        padding: '0.75rem',
        borderRadius: '5px',
        marginBottom: '1rem'
    },
    success: {
        background: '#efe',
        color: '#3c3',
        padding: '0.75rem',
        borderRadius: '5px',
        marginBottom: '1rem'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    label: {
        fontWeight: 'bold',
        color: '#333'
    },
    input: {
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '1rem'
    },
    textarea: {
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '1rem',
        fontFamily: 'inherit',
        resize: 'vertical'
    },
    fileInput: {
        padding: '0.5rem',
        border: '1px solid #ddd',
        borderRadius: '5px'
    },
    fileName: {
        fontSize: '0.85rem',
        color: '#666',
        marginTop: '0.5rem'
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem'
    },
    submitButton: {
        flex: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '0.75rem',
        borderRadius: '5px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    cancelButton: {
        flex: 1,
        background: '#f0f0f0',
        color: '#333',
        border: 'none',
        padding: '0.75rem',
        borderRadius: '5px',
        fontSize: '1rem',
        cursor: 'pointer'
    }
};
