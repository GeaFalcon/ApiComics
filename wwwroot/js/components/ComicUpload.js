const { useState, useRef } = React;

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
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (selectedFile) => {
        if (selectedFile) {
            // Validar tipo de archivo
            const validExtensions = ['.cbz', '.cbr', '.pdf', '.jpg', '.jpeg', '.png'];
            const fileName = selectedFile.name.toLowerCase();
            const isValid = validExtensions.some(ext => fileName.endsWith(ext));

            if (!isValid) {
                setError('Tipo de archivo no válido. Solo se permiten: CBZ, CBR, PDF, JPG, PNG');
                return;
            }

            setFile(selectedFile);
            setError('');
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileChange(droppedFile);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
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
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                        Subir Nuevo Comic
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Los comics subidos serán revisados por un administrador antes de ser publicados
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm animate-fade-in">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm animate-fade-in">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700 font-medium">{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        {/* Drag and Drop Area */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Archivo del Comic *
                            </label>
                            <div
                                onClick={handleClick}
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`
                                    relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                                    transition-all duration-300 ease-in-out
                                    ${isDragging
                                        ? 'border-purple-500 bg-purple-50 scale-105'
                                        : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                                    }
                                    ${file ? 'bg-green-50 border-green-400' : ''}
                                `}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={(e) => handleFileChange(e.target.files[0])}
                                    accept=".cbz,.cbr,.pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                />

                                {!file ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-center">
                                            <svg
                                                className={`w-20 h-20 transition-colors duration-300 ${
                                                    isDragging ? 'text-purple-500' : 'text-gray-400'
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xl font-semibold text-gray-700 mb-2">
                                                Arrastra aquí tu comic
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                o haz clic para seleccionar un archivo
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                                            <span className="px-3 py-1 bg-gray-100 rounded-full">CBZ</span>
                                            <span className="px-3 py-1 bg-gray-100 rounded-full">CBR</span>
                                            <span className="px-3 py-1 bg-gray-100 rounded-full">PDF</span>
                                            <span className="px-3 py-1 bg-gray-100 rounded-full">JPG</span>
                                            <span className="px-3 py-1 bg-gray-100 rounded-full">PNG</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-center">
                                            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-800 mb-1">
                                                {file.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                            }}
                                            className="mt-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            Eliminar archivo
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Título */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    required
                                    maxLength="200"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                    placeholder="Ingresa el título del comic"
                                />
                            </div>

                            {/* Autor */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Autor *
                                </label>
                                <input
                                    type="text"
                                    name="autor"
                                    value={formData.autor}
                                    onChange={handleChange}
                                    required
                                    maxLength="100"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                    placeholder="Nombre del autor"
                                />
                            </div>

                            {/* Formato */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Formato *
                                </label>
                                <select
                                    name="formato"
                                    value={formData.formato}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
                                >
                                    <option value="CBZ">CBZ</option>
                                    <option value="CBR">CBR</option>
                                    <option value="PDF">PDF</option>
                                    <option value="JPG">JPG/JPEG</option>
                                    <option value="PNG">PNG</option>
                                </select>
                            </div>

                            {/* Descripción */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    maxLength="1000"
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none"
                                    placeholder="Descripción del comic (opcional)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gray-50 px-8 py-6 flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Subiendo...
                                </span>
                            ) : (
                                'Subir Comic'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => onNavigate('home')}
                            className="flex-1 bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
