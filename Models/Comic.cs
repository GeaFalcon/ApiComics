using System.ComponentModel.DataAnnotations; //importamos anotaciones para validaciones 

namespace ComicReaderBackend.Models
{
    // Este modelo representa la tabla comic en la base de datos 
    public class Comic 
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "El título es obligatorio.")]
        public string Titulo { get; set; }

        [Required(ErrorMessage = "El autor es obligatorio.")]
        public string Autor { get; set; }

        [Required(ErrorMessage = "El formato es obligatorio.")]
        public string Formato { get; set; }

        [Required(ErrorMessage = "La ruta del archivo es obligatoria.")]
        public string RutaArchivo { get; set; }

        public DateTime FechaSubida { get; set; } = DateTime.UtcNow;
    }
}