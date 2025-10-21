using System.ComponentModel.DataAnnotations;

namespace ComicReaderBackend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Usuario necesario.")]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email necesario.")]
        [EmailAddress(ErrorMessage = "Email no válido.")]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Contraseña necesaria")]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = "Usuario"; // "Usuario" o "Admin"

        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;

        // Relaciones con otras tablas
        public ICollection<Comic>? ComicsSubidos { get; set; }
        public ICollection<Favorito>? Favoritos { get; set; }
        public ICollection<Voto>? Votos { get; set; }
        public ICollection<HistorialLectura>? HistorialLecturas { get; set; }
    }
}
