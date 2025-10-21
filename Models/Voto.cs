using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComicReaderBackend.Models
{
    public class Voto
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

        public DateTime FechaVoto { get; set; } = DateTime.UtcNow;
    }
}
