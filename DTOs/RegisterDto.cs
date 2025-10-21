using System.ComponentModel.DataAnnotations;

namespace ComicReaderBackend.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "El nombre de usuario es obligatorio.")]
        [MinLength(3, ErrorMessage = "El nombre de usuario debe tener al menos 3 caracteres.")]
        [MaxLength(50, ErrorMessage = "El nombre de usuario no puede exceder 50 caracteres.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "El email es obligatorio.")]
        [EmailAddress(ErrorMessage = "El formato del email no es válido.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Debe confirmar la contraseña.")]
        [Compare("Password", ErrorMessage = "Las contraseñas no coinciden.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
