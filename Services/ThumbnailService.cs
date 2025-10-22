using Docnet.Core;
using Docnet.Core.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using System.IO.Compression;

namespace ComicReaderBackend.Services
{
    public interface IThumbnailService
    {
        Task<string> GenerateThumbnailAsync(string filePath, string formato);
    }

    public class ThumbnailService : IThumbnailService
    {
        private readonly ILogger<ThumbnailService> _logger;
        private readonly IWebHostEnvironment _environment;
        private const int ThumbnailWidth = 300;
        private const int ThumbnailHeight = 450;

        public ThumbnailService(ILogger<ThumbnailService> logger, IWebHostEnvironment environment)
        {
            _logger = logger;
            _environment = environment;
        }

        public async Task<string> GenerateThumbnailAsync(string filePath, string formato)
        {
            try
            {
                _logger.LogInformation("Generando miniatura para archivo: {FilePath}, Formato: {Formato}", filePath, formato);

                return formato.ToUpper() switch
                {
                    "PDF" => await GeneratePdfThumbnailAsync(filePath),
                    "CBZ" => await GenerateCbzThumbnailAsync(filePath),
                    "CBR" => await GenerateCbrThumbnailAsync(filePath),
                    "JPG" or "JPEG" or "PNG" => await GenerateImageThumbnailAsync(filePath),
                    _ => throw new NotSupportedException($"Formato {formato} no soportado para miniaturas")
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al generar miniatura para {FilePath}", filePath);
                // Retornar ruta a imagen por defecto si hay error
                return "/images/no-thumbnail.png";
            }
        }

        private async Task<string> GeneratePdfThumbnailAsync(string filePath)
        {
            _logger.LogInformation("Generando miniatura de PDF: {FilePath}", filePath);

            try
            {
                using var docReader = DocLib.Instance.GetDocReader(filePath, new PageDimensions(ThumbnailWidth * 2, ThumbnailHeight * 2));

                if (docReader.GetPageCount() == 0)
                {
                    throw new Exception("El PDF no tiene páginas");
                }

                using var pageReader = docReader.GetPageReader(0); // Primera página
                var rawBytes = pageReader.GetImage();
                var width = pageReader.GetPageWidth();
                var height = pageReader.GetPageHeight();

                _logger.LogInformation("Página PDF renderizada: {Width}x{Height}, {Bytes} bytes", width, height, rawBytes.Length);

                // Convertir bytes a imagen usando ImageSharp
                using var image = Image.LoadPixelData<Bgra32>(rawBytes, width, height);

                // Redimensionar a miniatura
                image.Mutate(x => x.Resize(ThumbnailWidth, ThumbnailHeight));

                // Guardar miniatura
                var thumbnailFileName = $"thumb_{Path.GetFileNameWithoutExtension(filePath)}.jpg";
                var thumbnailsFolder = Path.Combine(_environment.WebRootPath, "thumbnails");

                if (!Directory.Exists(thumbnailsFolder))
                {
                    Directory.CreateDirectory(thumbnailsFolder);
                }

                var thumbnailPath = Path.Combine(thumbnailsFolder, thumbnailFileName);
                await image.SaveAsJpegAsync(thumbnailPath);

                _logger.LogInformation("Miniatura guardada en: {ThumbnailPath}", thumbnailPath);

                return $"/thumbnails/{thumbnailFileName}";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error específico al generar miniatura de PDF");
                throw;
            }
        }

        private async Task<string> GenerateCbzThumbnailAsync(string filePath)
        {
            _logger.LogInformation("Generando miniatura de CBZ: {FilePath}", filePath);

            using var archive = ZipFile.OpenRead(filePath);

            // Buscar la primera imagen en el archivo CBZ
            var imageEntry = archive.Entries
                .Where(e => !string.IsNullOrEmpty(e.Name))
                .Where(e => e.Name.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) ||
                           e.Name.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase) ||
                           e.Name.EndsWith(".png", StringComparison.OrdinalIgnoreCase))
                .OrderBy(e => e.FullName)
                .FirstOrDefault();

            if (imageEntry == null)
            {
                throw new Exception("No se encontraron imágenes en el archivo CBZ");
            }

            using var entryStream = imageEntry.Open();
            using var image = await Image.LoadAsync(entryStream);

            image.Mutate(x => x.Resize(ThumbnailWidth, ThumbnailHeight));

            var thumbnailFileName = $"thumb_{Path.GetFileNameWithoutExtension(filePath)}.jpg";
            var thumbnailsFolder = Path.Combine(_environment.WebRootPath, "thumbnails");

            if (!Directory.Exists(thumbnailsFolder))
            {
                Directory.CreateDirectory(thumbnailsFolder);
            }

            var thumbnailPath = Path.Combine(thumbnailsFolder, thumbnailFileName);
            await image.SaveAsJpegAsync(thumbnailPath);

            _logger.LogInformation("Miniatura de CBZ guardada en: {ThumbnailPath}", thumbnailPath);

            return $"/thumbnails/{thumbnailFileName}";
        }

        private async Task<string> GenerateCbrThumbnailAsync(string filePath)
        {
            _logger.LogWarning("CBR no soportado actualmente, usando imagen por defecto");
            // CBR requiere SharpCompress con soporte RAR, que puede tener problemas de licencia
            // Por ahora retornamos una imagen por defecto
            return await Task.FromResult("/images/cbr-placeholder.png");
        }

        private async Task<string> GenerateImageThumbnailAsync(string filePath)
        {
            _logger.LogInformation("Generando miniatura de imagen: {FilePath}", filePath);

            using var image = await Image.LoadAsync(filePath);

            image.Mutate(x => x.Resize(ThumbnailWidth, ThumbnailHeight));

            var thumbnailFileName = $"thumb_{Path.GetFileNameWithoutExtension(filePath)}.jpg";
            var thumbnailsFolder = Path.Combine(_environment.WebRootPath, "thumbnails");

            if (!Directory.Exists(thumbnailsFolder))
            {
                Directory.CreateDirectory(thumbnailsFolder);
            }

            var thumbnailPath = Path.Combine(thumbnailsFolder, thumbnailFileName);
            await image.SaveAsJpegAsync(thumbnailPath);

            _logger.LogInformation("Miniatura de imagen guardada en: {ThumbnailPath}", thumbnailPath);

            return $"/thumbnails/{thumbnailFileName}";
        }
    }
}
