using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComicReaderBackend.Models
{
    public class HistorialLectura
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        public int ComicId { get; set; }

        [ForeignKey("ComicId")]
        public Comic? Comic { get; set; }

        public DateTime FechaLectura { get; set; } = DateTime.UtcNow;

        // Página en la que se quedó el usuario (opcional para futuras mejoras)
        public int? PaginaActual { get; set; }
    }
}
