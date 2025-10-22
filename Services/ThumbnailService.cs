using System.IO.Compression;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;

namespace ComicReaderBackend.Services
{
    public class ThumbnailService : IThumbnailService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<ThumbnailService> _logger;

        public ThumbnailService(IWebHostEnvironment environment, ILogger<ThumbnailService> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        public async Task<string?> GenerateThumbnailAsync(string filePath, string formato)
        {
            try
            {
                if (string.IsNullOrEmpty(_environment.WebRootPath))
                {
                    _logger.LogError("WebRootPath no está configurado");
                    return null;
                }

                var thumbnailsFolder = Path.Combine(_environment.WebRootPath, "thumbnails");
                if (!Directory.Exists(thumbnailsFolder))
                {
                    Directory.CreateDirectory(thumbnailsFolder);
                }

                var thumbnailFileName = $"{Guid.NewGuid()}_thumb.jpg";
                var thumbnailPath = Path.Combine(thumbnailsFolder, thumbnailFileName);

                switch (formato.ToUpper())
                {
                    case "JPG":
                    case "JPEG":
                    case "PNG":
                        // Para imágenes, redimensionar directamente
                        await GenerateImageThumbnailAsync(filePath, thumbnailPath);
                        break;

                    case "PDF":
                        // Para PDF, intentar extraer la primera página como imagen
                        // Por ahora, usar imagen por defecto o implementar extracción de PDF
                        _logger.LogWarning("Generación de miniaturas para PDF no implementada aún");
                        return null;

                    case "CBZ":
                        // Para CBZ, extraer la primera imagen del archivo ZIP
                        await GenerateCbzThumbnailAsync(filePath, thumbnailPath);
                        break;

                    case "CBR":
                        // Para CBR, requiere librería adicional (SharpCompress)
                        _logger.LogWarning("Generación de miniaturas para CBR no implementada aún");
                        return null;

                    default:
                        _logger.LogWarning("Formato no soportado para generación de miniaturas: {Formato}", formato);
                        return null;
                }

                return "/thumbnails/" + thumbnailFileName;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al generar miniatura para {FilePath}", filePath);
                return null;
            }
        }

        private async Task GenerateImageThumbnailAsync(string sourcePath, string thumbnailPath)
        {
            using var image = await Image.LoadAsync(sourcePath);
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(300, 400),
                Mode = ResizeMode.Max
            }));

            await image.SaveAsJpegAsync(thumbnailPath, new JpegEncoder { Quality = 85 });
        }

        private async Task GenerateCbzThumbnailAsync(string cbzPath, string thumbnailPath)
        {
            using var archive = ZipFile.OpenRead(cbzPath);

            // Buscar la primera imagen en el archivo
            var imageEntry = archive.Entries
                .Where(e => !string.IsNullOrEmpty(e.Name))
                .Where(e => e.Name.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) ||
                           e.Name.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase) ||
                           e.Name.EndsWith(".png", StringComparison.OrdinalIgnoreCase))
                .OrderBy(e => e.FullName)
                .FirstOrDefault();

            if (imageEntry == null)
            {
                throw new Exception("No se encontró ninguna imagen en el archivo CBZ");
            }

            // Extraer la imagen temporalmente
            using var entryStream = imageEntry.Open();
            using var image = await Image.LoadAsync(entryStream);

            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(300, 400),
                Mode = ResizeMode.Max
            }));

            await image.SaveAsJpegAsync(thumbnailPath, new JpegEncoder { Quality = 85 });
        }
    }
}
