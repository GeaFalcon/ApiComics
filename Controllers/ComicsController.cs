using ComicReaderBackend.Data;
using ComicReaderBackend.Models;
using ComicReaderBackend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IO.Compression;

namespace ComicReaderBackend.Controllers
{
    [Route("api/comics")]
    [ApiController]
    public class ComicsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ComicsController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: /api/comics - Obtener todos los cómics aprobados
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetComics()
        {
            var comics = await _context.Comics
                .Where(c => c.Aprobado == true)
                .Include(c => c.SubidoPor)
                .Include(c => c.Votos)
                .Select(c => new
                {
                    c.Id,
                    c.Titulo,
                    c.Autor,
                    c.Descripcion,
                    c.Formato,
                    c.FechaSubida,
                    SubidoPor = c.SubidoPor != null ? c.SubidoPor.Username : "Unknown",
                    TotalVotos = c.Votos != null ? c.Votos.Count : 0
                })
                .OrderByDescending(c => c.FechaSubida)
                .ToListAsync();

            return Ok(comics);
        }

        // GET: /api/comics/pending - Obtener comics pendientes de aprobación (Solo Admin)
        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<object>>> GetPendingComics()
        {
            var comics = await _context.Comics
                .Where(c => c.Aprobado == false)
                .Include(c => c.SubidoPor)
                .Select(c => new
                {
                    c.Id,
                    c.Titulo,
                    c.Autor,
                    c.Descripcion,
                    c.Formato,
                    c.FechaSubida,
                    SubidoPor = c.SubidoPor != null ? c.SubidoPor.Username : "Unknown",
                    SubidoPorId = c.SubidoPorId
                })
                .OrderBy(c => c.FechaSubida)
                .ToListAsync();

            return Ok(comics);
        }

        // GET: /api/comics/my-uploads - Obtener comics subidos por el usuario actual
        [HttpGet("my-uploads")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetMyUploads()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var comics = await _context.Comics
                .Where(c => c.SubidoPorId == userId)
                .Include(c => c.Votos)
                .Select(c => new
                {
                    c.Id,
                    c.Titulo,
                    c.Autor,
                    c.Descripcion,
                    c.Formato,
                    c.FechaSubida,
                    c.Aprobado,
                    c.FechaAprobacion,
                    TotalVotos = c.Votos != null ? c.Votos.Count : 0
                })
                .OrderByDescending(c => c.FechaSubida)
                .ToListAsync();

            return Ok(comics);
        }

        // GET: /api/comics/{id} - Obtener un cómic por su ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Comic>> GetComicById(int id)
        {
            var comic = await _context.Comics
                .Include(c => c.SubidoPor)
                .Include(c => c.Votos)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (comic == null)
            {
                return NotFound(new { mensaje = $"No se encontró el cómic con ID {id}." });
            }

            // Solo mostrar comics aprobados a usuarios normales
            if (!comic.Aprobado && !User.IsInRole("Admin"))
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId == null || int.Parse(userId) != comic.SubidoPorId)
                {
                    return NotFound(new { mensaje = $"No se encontró el cómic con ID {id}." });
                }
            }

            return Ok(new
            {
                comic.Id,
                comic.Titulo,
                comic.Autor,
                comic.Descripcion,
                comic.Formato,
                comic.FechaSubida,
                comic.Aprobado,
                SubidoPor = comic.SubidoPor?.Username ?? "Unknown",
                TotalVotos = comic.Votos?.Count ?? 0,
                comic.RutaArchivo
            });
        }

        // POST: /api/comics/upload - Subir un nuevo cómic
        [HttpPost("upload")]
        [Authorize]
        public async Task<IActionResult> UploadComic([FromForm] ComicUploadDto uploadDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            if (uploadDto.Archivo == null || uploadDto.Archivo.Length == 0)
            {
                return BadRequest(new { mensaje = "El archivo es obligatorio." });
            }

            // Verificar formato permitido
            var formatosPermitidos = new List<string> { "pdf", "cbz", "cbr", "jpg", "png", "jpeg" };
            var extension = Path.GetExtension(uploadDto.Archivo.FileName).ToLower().TrimStart('.');

            if (!formatosPermitidos.Contains(extension))
            {
                return BadRequest(new { mensaje = "Formato no permitido. Usa PDF, CBZ, CBR o imágenes." });
            }

            // Verificar WebRootPath
            if (string.IsNullOrEmpty(_environment.WebRootPath))
            {
                return StatusCode(500, new { mensaje = "Error de configuración: WebRootPath no está configurado." });
            }

            // Guardar archivo
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = $"{Guid.NewGuid()}_{uploadDto.Archivo.FileName}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await uploadDto.Archivo.CopyToAsync(stream);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al guardar el archivo: {ex.Message}" });
            }

            // Crear el comic en la base de datos
            var nuevoComic = new Comic
            {
                Titulo = uploadDto.Titulo,
                Autor = uploadDto.Autor,
                Descripcion = uploadDto.Descripcion,
                Formato = uploadDto.Formato,
                RutaArchivo = "/uploads/" + fileName,
                FechaSubida = DateTime.UtcNow,
                SubidoPorId = userId,
                Aprobado = false // Los comics necesitan aprobación de un admin
            };

            _context.Comics.Add(nuevoComic);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Cómic subido correctamente. Está pendiente de aprobación por un administrador.",
                comic = new
                {
                    nuevoComic.Id,
                    nuevoComic.Titulo,
                    nuevoComic.Autor,
                    nuevoComic.Descripcion,
                    nuevoComic.Formato,
                    nuevoComic.FechaSubida,
                    nuevoComic.Aprobado
                }
            });
        }

        // PUT: /api/comics/{id}/approve - Aprobar un cómic (Solo Admin)
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveComic(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var comic = await _context.Comics.FindAsync(id);
            if (comic == null)
            {
                return NotFound(new { mensaje = $"No se encontró el cómic con ID {id}." });
            }

            if (comic.Aprobado)
            {
                return BadRequest(new { mensaje = "Este cómic ya está aprobado." });
            }

            comic.Aprobado = true;
            comic.FechaAprobacion = DateTime.UtcNow;
            comic.AprobadoPorId = userId;

            _context.Comics.Update(comic);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = $"El cómic '{comic.Titulo}' ha sido aprobado correctamente." });
        }

        // PUT: /api/comics/{id}/reject - Rechazar un cómic (Solo Admin)
        [HttpDelete("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectComic(int id)
        {
            var comic = await _context.Comics.FindAsync(id);

            if (comic == null)
            {
                return NotFound(new { mensaje = $"No se encontró el cómic con ID {id}." });
            }

            // Eliminar el archivo físico
            if (!string.IsNullOrEmpty(_environment.WebRootPath))
            {
                var filePath = Path.Combine(_environment.WebRootPath, comic.RutaArchivo.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                {
                    try
                    {
                        System.IO.File.Delete(filePath);
                    }
                    catch (Exception ex)
                    {
                        // Log pero continúa con la eliminación de la base de datos
                        Console.WriteLine($"Error al eliminar archivo físico: {ex.Message}");
                    }
                }
            }

            _context.Comics.Remove(comic);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = $"El cómic con ID {id} ha sido rechazado y eliminado." });
        }

        // GET: /api/comics/download/{id} - Descargar un cómic
        [HttpGet("download/{id}")]
        [Authorize]
        public async Task<IActionResult> DownloadComic(int id)
        {
            var comic = await _context.Comics.FindAsync(id);

            if (comic == null || !comic.Aprobado)
            {
                return NotFound(new { mensaje = $"No se encontró el cómic con ID {id}." });
            }

            if (string.IsNullOrEmpty(_environment.WebRootPath))
            {
                return StatusCode(500, new { mensaje = "Error de configuración: WebRootPath no está configurado." });
            }

            var filePath = Path.Combine(_environment.WebRootPath, comic.RutaArchivo.TrimStart('/'));

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new { mensaje = "El archivo del cómic no existe en el servidor." });
            }

            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            var contentType = "application/octet-stream";

            return File(fileStream, contentType, Path.GetFileName(filePath));
        }

        // GET: /api/comics/view/{id} - Ver un cómic
        [HttpGet("view/{id}")]
        [Authorize]
        public async Task<IActionResult> ViewComic(int id)
        {
            var comic = await _context.Comics.FindAsync(id);

            if (comic == null || !comic.Aprobado)
            {
                return NotFound(new { mensaje = $"No se encontró el cómic con ID {id}." });
            }

            if (string.IsNullOrEmpty(_environment.WebRootPath))
            {
                return StatusCode(500, new { mensaje = "Error de configuración: WebRootPath no está configurado." });
            }

            var filePath = Path.Combine(_environment.WebRootPath, comic.RutaArchivo.TrimStart('/'));

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new { mensaje = "El archivo del cómic no existe en el servidor." });
            }

            var extension = Path.GetExtension(filePath).ToLower();
            var contentType = extension switch
            {
                ".pdf" => "application/pdf",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".cbz" => "application/vnd.comicbook+zip",
                ".cbr" => "application/vnd.comicbook-rar",
                _ => "application/octet-stream"
            };

            return PhysicalFile(filePath, contentType);
        }

        // GET: /api/comics/view/pages/{id} - Extraer y ver páginas de un cómic CBZ/CBR
        [HttpGet("view/pages/{id}")]
        [Authorize]
        public async Task<IActionResult> ViewComicPages(int id)
        {
            var comic = await _context.Comics.FindAsync(id);

            if (comic == null || !comic.Aprobado)
            {
                return NotFound(new { mensaje = $"No se encontró el cómic con ID {id}." });
            }

            if (string.IsNullOrEmpty(_environment.WebRootPath))
            {
                return StatusCode(500, new { mensaje = "Error de configuración: WebRootPath no está configurado." });
            }

            var filePath = Path.Combine(_environment.WebRootPath, comic.RutaArchivo.TrimStart('/'));

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new { mensaje = "El archivo del cómic no existe en el servidor." });
            }

            var extractPath = Path.Combine(_environment.WebRootPath, "extracted", comic.Id.ToString());

            if (!Directory.Exists(extractPath))
            {
                Directory.CreateDirectory(extractPath);
            }

            try
            {
                // Extraer las imágenes del CBZ (ZIP)
                using (var archive = ZipFile.OpenRead(filePath))
                {
                    foreach (var entry in archive.Entries)
                    {
                        if (string.IsNullOrEmpty(entry.Name)) continue;

                        var entryPath = Path.Combine(extractPath, entry.Name);
                        if (!System.IO.File.Exists(entryPath))
                        {
                            entry.ExtractToFile(entryPath);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al extraer el archivo: {ex.Message}" });
            }

            // Obtener las URLs de las imágenes extraídas
            var images = Directory.GetFiles(extractPath)
                .Where(f => f.EndsWith(".jpg") || f.EndsWith(".jpeg") || f.EndsWith(".png"))
                .OrderBy(f => f)
                .Select(img => $"{Request.Scheme}://{Request.Host}/extracted/{comic.Id}/{Path.GetFileName(img)}")
                .ToList();

            return Ok(new { paginas = images });
        }

        // DELETE: /api/comics/{id} - Eliminar un cómic (Solo Admin o el usuario que lo subió)
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteComic(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            var comic = await _context.Comics.FindAsync(id);

            if (comic == null)
            {
                return NotFound(new { mensaje = $"No se encontró el cómic con ID {id}." });
            }

            // Solo el admin o el usuario que subió el comic puede eliminarlo
            if (userRole != "Admin" && comic.SubidoPorId != userId)
            {
                return Forbid();
            }

            // Eliminar el archivo físico
            if (!string.IsNullOrEmpty(_environment.WebRootPath))
            {
                var filePath = Path.Combine(_environment.WebRootPath, comic.RutaArchivo.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                {
                    try
                    {
                        System.IO.File.Delete(filePath);
                    }
                    catch (Exception ex)
                    {
                        // Log pero continúa con la eliminación de la base de datos
                        Console.WriteLine($"Error al eliminar archivo físico: {ex.Message}");
                    }
                }
            }

            _context.Comics.Remove(comic);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = $"El cómic con ID {id} ha sido eliminado correctamente." });
        }
    }
}
