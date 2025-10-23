using System.ComponentModel.DataAnnotations;

namespace ComicReaderBackend.DTOs
{
    public class SerieCreateDto
    {
        [Required(ErrorMessage = "El título es obligatorio.")]
        [MaxLength(200)]
        public string Titulo { get; set; } = string.Empty;

        [Required(ErrorMessage = "El autor es obligatorio.")]
        [MaxLength(100)]
        public string Autor { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Descripcion { get; set; }

        [MaxLength(50)]
        public string? Genero { get; set; }

        [MaxLength(20)]
        public string? Estado { get; set; } // "En curso", "Finalizada", "Pausada"

        public int? AnoPublicacion { get; set; }

        public IFormFile? Portada { get; set; }
    }
}
