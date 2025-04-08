// Importa las anotaciones de datos necesarias para definir atributos como [Key] y [Required]
using System.ComponentModel.DataAnnotations;

namespace ComicReaderBackend.Models
{
    // Esta clase representa un modelo de datos para el login.
    public class User 
    {
        // [Key] indica que esta propiedad es la clave primaria.
        [Key]
        public int Id { get; set; }

        // [Required] marca la propiedad como obligatoria y se muestra un mensaje de error si no se proporciona.
        [Required(ErrorMessage = "Usuario necesario.")]
        public string User { get; set; }

        // [Required] también se utiliza para la contraseña, marcándola como obligatoria.
        [Required(ErrorMessage = "Contraseña necesaria")]
        public string Password { get; set; }
    }
}
