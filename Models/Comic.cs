using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComicReaderBackend.Models
{
    public class Comic
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "El título es obligatorio.")]
        [MaxLength(200)]
        public string Titulo { get; set; } = string.Empty;

        [Required(ErrorMessage = "El autor es obligatorio.")]
        [MaxLength(100)]
        public string Autor { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Descripcion { get; set; }

        [Required(ErrorMessage = "El formato es obligatorio.")]
        [MaxLength(20)]
        public string Formato { get; set; } = string.Empty;

        [Required(ErrorMessage = "La ruta del archivo es obligatoria.")]
        public string RutaArchivo { get; set; } = "wwwroot/uploads/";

        [MaxLength(500)]
        public string? RutaMiniatura { get; set; }

        public DateTime FechaSubida { get; set; } = DateTime.UtcNow;

        // Estado de aprobación
        public bool Aprobado { get; set; } = false;
        public DateTime? FechaAprobacion { get; set; }
        public int? AprobadoPorId { get; set; }

        // Relación con el usuario que subió el comic
        [Required]
        public int SubidoPorId { get; set; }

        [ForeignKey("SubidoPorId")]
        public User? SubidoPor { get; set; }

        // Admin que aprobó el comic
        [ForeignKey("AprobadoPorId")]
        public User? AprobadoPor { get; set; }

        // Relaciones
        public ICollection<Favorito>? Favoritos { get; set; }
        public ICollection<Voto>? Votos { get; set; }
        public ICollection<HistorialLectura>? HistorialLecturas { get; set; }

        // Propiedades calculadas
        [NotMapped]
        public int TotalVotos => Votos?.Count ?? 0;
    }
}