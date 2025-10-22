using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ComicReaderBackend.DTOs
{
    public class ComicUploadDto
    {
        [Required(ErrorMessage = "El título es obligatorio.")]
        [MaxLength(200)]
        [FromForm(Name = "titulo")]
        public string Titulo { get; set; } = string.Empty;

        [Required(ErrorMessage = "El autor es obligatorio.")]
        [MaxLength(100)]
        [FromForm(Name = "autor")]
        public string Autor { get; set; } = string.Empty;

        [MaxLength(1000)]
        [FromForm(Name = "descripcion")]
        public string? Descripcion { get; set; }

        // Formato ahora es opcional - se detecta automáticamente del archivo
        [FromForm(Name = "formato")]
        public string? Formato { get; set; }

        [Required(ErrorMessage = "El archivo es obligatorio.")]
        [FromForm(Name = "archivo")]
        public IFormFile Archivo { get; set; } = null!;
    }
}
