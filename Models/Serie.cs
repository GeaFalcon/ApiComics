using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComicReaderBackend.Models
{
    public class Serie
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "El título de la serie es obligatorio.")]
        [MaxLength(200)]
        public string Titulo { get; set; } = string.Empty;

        [Required(ErrorMessage = "El autor de la serie es obligatorio.")]
        [MaxLength(100)]
        public string Autor { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Descripcion { get; set; }

        [MaxLength(500)]
        public string? RutaPortada { get; set; }

        [MaxLength(50)]
        public string? Genero { get; set; }

        [MaxLength(20)]
        public string? Estado { get; set; } // "En curso", "Finalizada", "Pausada"

        public int? AnoPublicacion { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        // Relación con el usuario que creó la serie
        [Required]
        public int CreadoPorId { get; set; }

        [ForeignKey("CreadoPorId")]
        public User? CreadoPor { get; set; }

        // Relación uno-a-muchos con Comics
        public ICollection<Comic>? Comics { get; set; }

        // Propiedades calculadas
        [NotMapped]
        public int TotalCapitulos => Comics?.Count ?? 0;

        [NotMapped]
        public int TotalVotos => Comics?.Sum(c => c.TotalVotos) ?? 0;
    }
}
