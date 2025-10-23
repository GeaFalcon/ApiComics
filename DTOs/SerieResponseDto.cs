namespace ComicReaderBackend.DTOs
{
    public class SerieResponseDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Autor { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public string? RutaPortada { get; set; }
        public string? Genero { get; set; }
        public string? Estado { get; set; }
        public int? AnoPublicacion { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int CreadoPorId { get; set; }
        public string? CreadoPorUsername { get; set; }
        public int TotalCapitulos { get; set; }
        public int TotalVotos { get; set; }
    }
}
