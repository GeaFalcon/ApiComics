using ComicReaderBackend.Data;
using ComicReaderBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ComicReaderBackend.Controllers
{
    [Route("api/user")]
    [ApiController]
    [Authorize]
    public class UserInteractionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserInteractionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ============= FAVORITOS =============

        // POST: /api/user/favorites/{comicId} - Agregar un comic a favoritos
        [HttpPost("favorites/{comicId}")]
        public async Task<IActionResult> AddToFavorites(int comicId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            // Verificar que el comic existe y está aprobado
            var comic = await _context.Comics.FindAsync(comicId);
            if (comic == null || !comic.Aprobado)
            {
                return NotFound(new { mensaje = "Comic no encontrado." });
            }

            // Verificar si ya está en favoritos
            var existeFavorito = await _context.Favoritos
                .AnyAsync(f => f.UserId == userId && f.ComicId == comicId);

            if (existeFavorito)
            {
                return BadRequest(new { mensaje = "Este comic ya está en tus favoritos." });
            }

            var favorito = new Favorito
            {
                UserId = userId,
                ComicId = comicId,
                FechaAgregado = DateTime.UtcNow
            };

            _context.Favoritos.Add(favorito);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Comic agregado a favoritos correctamente." });
        }

        // DELETE: /api/user/favorites/{comicId} - Eliminar un comic de favoritos
        [HttpDelete("favorites/{comicId}")]
        public async Task<IActionResult> RemoveFromFavorites(int comicId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var favorito = await _context.Favoritos
                .FirstOrDefaultAsync(f => f.UserId == userId && f.ComicId == comicId);

            if (favorito == null)
            {
                return NotFound(new { mensaje = "Este comic no está en tus favoritos." });
            }

            _context.Favoritos.Remove(favorito);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Comic eliminado de favoritos correctamente." });
        }

        // GET: /api/user/favorites - Obtener todos los favoritos del usuario
        [HttpGet("favorites")]
        public async Task<ActionResult<IEnumerable<object>>> GetFavorites()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var favoritos = await _context.Favoritos
                .Where(f => f.UserId == userId)
                .Include(f => f.Comic)
                    .ThenInclude(c => c!.Votos)
                .Include(f => f.Comic)
                    .ThenInclude(c => c!.SubidoPor)
                .Where(f => f.Comic != null)
                .OrderByDescending(f => f.FechaAgregado)
                .Select(f => new
                {
                    favoritoId = f.Id,
                    fechaAgregado = f.FechaAgregado,
                    comic = new
                    {
                        f.Comic!.Id,
                        f.Comic.Titulo,
                        f.Comic.Autor,
                        f.Comic.Descripcion,
                        f.Comic.Formato,
                        f.Comic.FechaSubida,
                        subidoPor = f.Comic.SubidoPor != null ? f.Comic.SubidoPor.Username : "Unknown",
                        totalVotos = f.Comic.Votos != null ? f.Comic.Votos.Count : 0
                    }
                })
                .ToListAsync();

            return Ok(favoritos);
        }

        // ============= VOTOS =============

        // POST: /api/user/votes/{comicId} - Votar por un comic
        [HttpPost("votes/{comicId}")]
        public async Task<IActionResult> VoteComic(int comicId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            // Verificar que el comic existe y está aprobado
            var comic = await _context.Comics.FindAsync(comicId);
            if (comic == null || !comic.Aprobado)
            {
                return NotFound(new { mensaje = "Comic no encontrado." });
            }

            // Verificar si ya votó
            var existeVoto = await _context.Votos
                .AnyAsync(v => v.UserId == userId && v.ComicId == comicId);

            if (existeVoto)
            {
                return BadRequest(new { mensaje = "Ya has votado por este comic." });
            }

            var voto = new Voto
            {
                UserId = userId,
                ComicId = comicId,
                FechaVoto = DateTime.UtcNow
            };

            _context.Votos.Add(voto);
            await _context.SaveChangesAsync();

            // Obtener el total de votos actualizado
            var totalVotos = await _context.Votos.CountAsync(v => v.ComicId == comicId);

            return Ok(new
            {
                mensaje = "Voto registrado correctamente.",
                totalVotos
            });
        }

        // DELETE: /api/user/votes/{comicId} - Eliminar voto de un comic
        [HttpDelete("votes/{comicId}")]
        public async Task<IActionResult> RemoveVote(int comicId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var voto = await _context.Votos
                .FirstOrDefaultAsync(v => v.UserId == userId && v.ComicId == comicId);

            if (voto == null)
            {
                return NotFound(new { mensaje = "No has votado por este comic." });
            }

            _context.Votos.Remove(voto);
            await _context.SaveChangesAsync();

            // Obtener el total de votos actualizado
            var totalVotos = await _context.Votos.CountAsync(v => v.ComicId == comicId);

            return Ok(new
            {
                mensaje = "Voto eliminado correctamente.",
                totalVotos
            });
        }

        // GET: /api/user/votes - Obtener todos los comics votados por el usuario
        [HttpGet("votes")]
        public async Task<ActionResult<IEnumerable<object>>> GetVotedComics()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var votos = await _context.Votos
                .Where(v => v.UserId == userId)
                .Include(v => v.Comic)
                    .ThenInclude(c => c!.SubidoPor)
                .Include(v => v.Comic)
                    .ThenInclude(c => c!.Votos)
                .Where(v => v.Comic != null)
                .OrderByDescending(v => v.FechaVoto)
                .Select(v => new
                {
                    votoId = v.Id,
                    fechaVoto = v.FechaVoto,
                    comic = new
                    {
                        v.Comic!.Id,
                        v.Comic.Titulo,
                        v.Comic.Autor,
                        v.Comic.Descripcion,
                        v.Comic.Formato,
                        v.Comic.FechaSubida,
                        subidoPor = v.Comic.SubidoPor != null ? v.Comic.SubidoPor.Username : "Unknown",
                        totalVotos = v.Comic.Votos != null ? v.Comic.Votos.Count : 0
                    }
                })
                .ToListAsync();

            return Ok(votos);
        }

        // GET: /api/user/votes/check/{comicId} - Verificar si el usuario ha votado por un comic
        [HttpGet("votes/check/{comicId}")]
        public async Task<ActionResult<object>> CheckVote(int comicId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var hasVoted = await _context.Votos
                .AnyAsync(v => v.UserId == userId && v.ComicId == comicId);

            return Ok(new { hasVoted });
        }

        // ============= HISTORIAL DE LECTURA =============

        // POST: /api/user/history/{comicId} - Registrar lectura de un comic
        [HttpPost("history/{comicId}")]
        public async Task<IActionResult> AddToHistory(int comicId, [FromBody] int? paginaActual = null)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            // Verificar que el comic existe y está aprobado
            var comic = await _context.Comics.FindAsync(comicId);
            if (comic == null || !comic.Aprobado)
            {
                return NotFound(new { mensaje = "Comic no encontrado." });
            }

            // Verificar si ya existe en el historial
            var historialExistente = await _context.HistorialLecturas
                .FirstOrDefaultAsync(h => h.UserId == userId && h.ComicId == comicId);

            if (historialExistente != null)
            {
                // Actualizar fecha de lectura y página
                historialExistente.FechaLectura = DateTime.UtcNow;
                if (paginaActual.HasValue)
                {
                    historialExistente.PaginaActual = paginaActual.Value;
                }
                _context.HistorialLecturas.Update(historialExistente);
            }
            else
            {
                // Crear nuevo registro
                var nuevoHistorial = new HistorialLectura
                {
                    UserId = userId,
                    ComicId = comicId,
                    FechaLectura = DateTime.UtcNow,
                    PaginaActual = paginaActual
                };
                _context.HistorialLecturas.Add(nuevoHistorial);
            }

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Lectura registrada correctamente." });
        }

        // GET: /api/user/history - Obtener historial de lectura del usuario
        [HttpGet("history")]
        public async Task<ActionResult<IEnumerable<object>>> GetReadingHistory()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var historial = await _context.HistorialLecturas
                .Where(h => h.UserId == userId)
                .Include(h => h.Comic)
                    .ThenInclude(c => c!.SubidoPor)
                .Include(h => h.Comic)
                    .ThenInclude(c => c!.Votos)
                .Where(h => h.Comic != null)
                .OrderByDescending(h => h.FechaLectura)
                .Select(h => new
                {
                    historialId = h.Id,
                    fechaLectura = h.FechaLectura,
                    paginaActual = h.PaginaActual,
                    comic = new
                    {
                        h.Comic!.Id,
                        h.Comic.Titulo,
                        h.Comic.Autor,
                        h.Comic.Descripcion,
                        h.Comic.Formato,
                        h.Comic.FechaSubida,
                        subidoPor = h.Comic.SubidoPor != null ? h.Comic.SubidoPor.Username : "Unknown",
                        totalVotos = h.Comic.Votos != null ? h.Comic.Votos.Count : 0
                    }
                })
                .ToListAsync();

            return Ok(historial);
        }

        // DELETE: /api/user/history/{comicId} - Eliminar un comic del historial
        [HttpDelete("history/{comicId}")]
        public async Task<IActionResult> RemoveFromHistory(int comicId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var historial = await _context.HistorialLecturas
                .FirstOrDefaultAsync(h => h.UserId == userId && h.ComicId == comicId);

            if (historial == null)
            {
                return NotFound(new { mensaje = "Este comic no está en tu historial." });
            }

            _context.HistorialLecturas.Remove(historial);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Comic eliminado del historial correctamente." });
        }

        // GET: /api/user/stats - Obtener estadísticas del usuario
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetUserStats()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var totalFavoritos = await _context.Favoritos.CountAsync(f => f.UserId == userId);
            var totalVotos = await _context.Votos.CountAsync(v => v.UserId == userId);
            var totalLeidos = await _context.HistorialLecturas.CountAsync(h => h.UserId == userId);
            var totalSubidos = await _context.Comics.CountAsync(c => c.SubidoPorId == userId);
            var totalAprobados = await _context.Comics.CountAsync(c => c.SubidoPorId == userId && c.Aprobado);
            var totalPendientes = await _context.Comics.CountAsync(c => c.SubidoPorId == userId && !c.Aprobado);

            return Ok(new
            {
                favoritos = totalFavoritos,
                votos = totalVotos,
                comicsLeidos = totalLeidos,
                comicsSubidos = totalSubidos,
                comicsAprobados = totalAprobados,
                comicsPendientes = totalPendientes
            });
        }
    }
}
