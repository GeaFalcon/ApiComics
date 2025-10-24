using ComicReaderBackend.Data;
using ComicReaderBackend.Models;
using ComicReaderBackend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ComicReaderBackend.Controllers
{
    [Route("api/series")]
    [ApiController]
    public class SeriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<SeriesController> _logger;

        public SeriesController(ApplicationDbContext context, IWebHostEnvironment environment, ILogger<SeriesController> logger)
        {
            _context = context;
            _environment = environment;
            _logger = logger;
        }

        // GET: /api/series - Obtener todas las series
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SerieResponseDto>>> GetSeries()
        {
            var series = await _context.Series
                .Include(s => s.CreadoPor)
                .Include(s => s.Comics)
                    .ThenInclude(c => c.Votos)
                .Select(s => new SerieResponseDto
                {
                    Id = s.Id,
                    Titulo = s.Titulo,
                    Autor = s.Autor,
                    Descripcion = s.Descripcion,
                    RutaPortada = s.RutaPortada,
                    Genero = s.Genero,
                    Estado = s.Estado,
                    AnoPublicacion = s.AnoPublicacion,
                    FechaCreacion = s.FechaCreacion,
                    CreadoPorId = s.CreadoPorId,
                    CreadoPorUsername = s.CreadoPor != null ? s.CreadoPor.Username : "Unknown",
                    TotalCapitulos = s.Comics != null ? s.Comics.Count(c => c.Aprobado) : 0,
                    TotalVotos = s.Comics != null ? s.Comics.Where(c => c.Aprobado).Sum(c => c.Votos != null ? c.Votos.Count : 0) : 0
                })
                .OrderByDescending(s => s.FechaCreacion)
                .ToListAsync();

            return Ok(series);
        }

        // GET: /api/series/{id} - Obtener detalle de una serie con todos sus capítulos
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetSerie(int id)
        {
            var serie = await _context.Series
                .Include(s => s.CreadoPor)
                .Include(s => s.Comics!)
                    .ThenInclude(c => c.SubidoPor)
                .Include(s => s.Comics!)
                    .ThenInclude(c => c.Votos!)
                .Where(s => s.Id == id)
                .Select(s => new
                {
                    s.Id,
                    s.Titulo,
                    s.Autor,
                    s.Descripcion,
                    s.RutaPortada,
                    s.Genero,
                    s.Estado,
                    s.AnoPublicacion,
                    s.FechaCreacion,
                    s.CreadoPorId,
                    CreadoPorUsername = s.CreadoPor != null ? s.CreadoPor.Username : "Unknown",
                    Capitulos = (s.Comics ?? new List<Comic>())
                        .Where(c => c.Aprobado)
                        .OrderBy(c => c.NumeroVolumen)
                        .ThenBy(c => c.NumeroCapitulo)
                        .Select(c => new
                        {
                            c.Id,
                            c.Titulo,
                            c.TituloCapitulo,
                            c.NumeroCapitulo,
                            c.NumeroVolumen,
                            c.Descripcion,
                            c.Formato,
                            c.RutaMiniatura,
                            c.FechaSubida,
                            SubidoPor = c.SubidoPor != null ? c.SubidoPor.Username : "Unknown",
                            TotalVotos = c.Votos != null ? c.Votos.Count : 0
                        }).ToList(),
                    TotalCapitulos = s.Comics != null ? s.Comics.Count(c => c.Aprobado) : 0,
                    TotalVotos = s.Comics != null ? s.Comics.Where(c => c.Aprobado).Sum(c => c.Votos != null ? c.Votos.Count : 0) : 0
                })
                .FirstOrDefaultAsync();

            if (serie == null)
            {
                return NotFound(new { mensaje = "Serie no encontrada" });
            }

            return Ok(serie);
        }

        // POST: /api/series - Crear nueva serie
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<SerieResponseDto>> CreateSerie([FromForm] SerieCreateDto serieDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

                if (userId == 0)
                {
                    return Unauthorized(new { mensaje = "Usuario no autenticado" });
                }

                // Crear la serie
                var serie = new Serie
                {
                    Titulo = serieDto.Titulo,
                    Autor = serieDto.Autor,
                    Descripcion = serieDto.Descripcion,
                    Genero = serieDto.Genero,
                    Estado = serieDto.Estado ?? "En curso",
                    AnoPublicacion = serieDto.AnoPublicacion,
                    CreadoPorId = userId,
                    FechaCreacion = DateTime.UtcNow
                };

                // Manejar la portada si se proporcionó
                if (serieDto.Portada != null)
                {
                    var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "portadas");
                    Directory.CreateDirectory(uploadsPath);

                    var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(serieDto.Portada.FileName)}";
                    var filePath = Path.Combine(uploadsPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await serieDto.Portada.CopyToAsync(stream);
                    }

                    serie.RutaPortada = $"/uploads/portadas/{fileName}";
                }

                _context.Series.Add(serie);
                await _context.SaveChangesAsync();

                var user = await _context.Users.FindAsync(userId);

                var response = new SerieResponseDto
                {
                    Id = serie.Id,
                    Titulo = serie.Titulo,
                    Autor = serie.Autor,
                    Descripcion = serie.Descripcion,
                    RutaPortada = serie.RutaPortada,
                    Genero = serie.Genero,
                    Estado = serie.Estado,
                    AnoPublicacion = serie.AnoPublicacion,
                    FechaCreacion = serie.FechaCreacion,
                    CreadoPorId = serie.CreadoPorId,
                    CreadoPorUsername = user?.Username ?? "Unknown",
                    TotalCapitulos = 0,
                    TotalVotos = 0
                };

                return CreatedAtAction(nameof(GetSerie), new { id = serie.Id }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear la serie");
                return StatusCode(500, new { mensaje = "Error al crear la serie", error = ex.Message });
            }
        }

        // PUT: /api/series/{id} - Actualizar serie
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateSerie(int id, [FromForm] SerieCreateDto serieDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                var serie = await _context.Series.FindAsync(id);

                if (serie == null)
                {
                    return NotFound(new { mensaje = "Serie no encontrada" });
                }

                // Solo el creador o un admin pueden editar la serie
                if (serie.CreadoPorId != userId && userRole != "Admin")
                {
                    return Forbid();
                }

                // Actualizar campos
                serie.Titulo = serieDto.Titulo;
                serie.Autor = serieDto.Autor;
                serie.Descripcion = serieDto.Descripcion;
                serie.Genero = serieDto.Genero;
                serie.Estado = serieDto.Estado ?? serie.Estado;
                serie.AnoPublicacion = serieDto.AnoPublicacion;

                // Actualizar portada si se proporcionó una nueva
                if (serieDto.Portada != null)
                {
                    // Eliminar portada anterior si existe
                    if (!string.IsNullOrEmpty(serie.RutaPortada))
                    {
                        var oldFilePath = Path.Combine(_environment.WebRootPath, serie.RutaPortada.TrimStart('/'));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }

                    var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "portadas");
                    Directory.CreateDirectory(uploadsPath);

                    var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(serieDto.Portada.FileName)}";
                    var filePath = Path.Combine(uploadsPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await serieDto.Portada.CopyToAsync(stream);
                    }

                    serie.RutaPortada = $"/uploads/portadas/{fileName}";
                }

                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Serie actualizada exitosamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la serie");
                return StatusCode(500, new { mensaje = "Error al actualizar la serie", error = ex.Message });
            }
        }

        // DELETE: /api/series/{id} - Eliminar serie
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteSerie(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                var serie = await _context.Series
                    .Include(s => s.Comics)
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (serie == null)
                {
                    return NotFound(new { mensaje = "Serie no encontrada" });
                }

                // Solo el creador o un admin pueden eliminar la serie
                if (serie.CreadoPorId != userId && userRole != "Admin")
                {
                    return Forbid();
                }

                // Eliminar portada si existe
                if (!string.IsNullOrEmpty(serie.RutaPortada))
                {
                    var filePath = Path.Combine(_environment.WebRootPath, serie.RutaPortada.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                // Los comics asociados no se eliminarán, solo se desvinculan (SerieId se pone en null)
                _context.Series.Remove(serie);
                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Serie eliminada exitosamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar la serie");
                return StatusCode(500, new { mensaje = "Error al eliminar la serie", error = ex.Message });
            }
        }
    }
}
