using System.ComponentModel.DataAnnotations;

namespace ComicReaderBackend.DTOs
{
    public class ComicUploadDto
    {
        [Required(ErrorMessage = "El título es obligatorio.")]
        [MaxLength(200)]
        public string Titulo { get; set; } = string.Empty;

        [Required(ErrorMessage = "El autor es obligatorio.")]
        [MaxLength(100)]
        public string Autor { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Descripcion { get; set; }

        [MaxLength(20)]
        public string? Formato { get; set; }

        [Required(ErrorMessage = "El archivo es obligatorio.")]
        public IFormFile Archivo { get; set; } = null!;
    }
}
