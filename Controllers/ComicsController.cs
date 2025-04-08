using ComicReaderBackend.Data;
using ComicReaderBackend.Models;
namespace ComicReaderBackend.Controllers{
    [Route("api/comics")] // 🔹 La ruta base será /api/comics
    [ApiController]
    public class ComicsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment; // 🔹 Agregar esta variable
        // 🔹 Inyectamos la base de datos en el controlador
        public ComicsController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // 🔹 Endpoint GET para obtener todos los cómics
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Comic>>> GetComics()
        {
        var comics = await _context.comics.ToListAsync();
        
        Console.WriteLine($"🔍 Cantidad de cómics encontrados: {comics.Count}");
        
        return Ok(comics);

        }
        // 🔹 GET: /api/comics/{id} -> Obtener un cómic por su ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Comic>> GetComicById(int id)
        {
            var comic = await _context.comics.FirstOrDefaultAsync(c => c.Id == id);

            if (comic == null)
            {
                return NotFound(new { mensaje = $"No se encontró el cómic con ID {id}." });
            }

            return Ok(comic);
        }
        // GET /api/comics/view/{id}
        [HttpGet("download/{id}")]
        public async Task<IActionResult> DownloadComic(int id)
        {
            var comic = await _context.comics.FindAsync(id);

            if (comic == null)
            {
                return NotFound(new { mensaje = $"No se encontró el cómic con ID {id}." });
            }

            var filePath = Path.Combine(_environment.WebRootPath, comic.RutaArchivo.TrimStart('/'));

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new { mensaje = "El archivo del cómic no existe en el servidor." });
            }

            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            var contentType = "application/octet-stream"; // Tipo genérico, puedes mejorarlo según el formato

            return File(fileStream, contentType, Path.GetFileName(filePath));
        }
        [HttpGet("view/{id}")]
        public async Task<IActionResult> ViewComic(int id)
        {
            var comic = await _context.comics.FindAsync(id);

            if (comic == null)
            {
                return NotFound(new { mensaje = $"No se encontró el cómic con ID {id}." });
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
                _ => "application/octet-stream" // Para otros formatos desconocidos
            };

            return PhysicalFile(filePath, contentType);
        }

        // Con este endpoint se extraen las paginas de los formatos cbz y cbr, y se almacenan en la carpeta "extracted" dentro de la carpeta "wwwroot".
        [HttpGet("view/pages/{id}")]
        public async Task<IActionResult> ViewComicPages(int id)
        {
            var comic = await _context.comics.FindAsync(id);

            if (comic == null)
            {
                return NotFound(new { mensaje = $"No se encontró el cómic con ID {id}." });
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

            // Extraer las imágenes del CBZ (ZIP)
            using (var archive = ZipFile.OpenRead(filePath))
            {
                foreach (var entry in archive.Entries)
                {
                    var entryPath = Path.Combine(extractPath, entry.Name);
                    if (!System.IO.File.Exists(entryPath)) // Evitar sobrescribir
                    {
                        entry.ExtractToFile(entryPath);
                    }
                }
            }

            // Obtener las URLs de las imágenes extraídas
            var images = Directory.GetFiles(extractPath)
                .Select(img => $"{Request.Scheme}://{Request.Host}/extracted/{comic.Id}/{Path.GetFileName(img)}")
                .ToList();

            return Ok(new { paginas = images });
        }

        // 🔹 POST: /api/comics/upload -> Subir un cómic con archivo
        [HttpPost("upload")]
        public async Task<IActionResult> UploadComic(
            [FromForm] string titulo,
            [FromForm] string autor,
            [FromForm] string formato,
            [FromForm] IFormFile archivo)
        {
            if (archivo == null || archivo.Length == 0)
            {
                return BadRequest(new { mensaje = "El archivo es obligatorio." });
            }

            // 🔹 Verificar si el formato es válido
            var formatosPermitidos = new List<string> { "pdf", "cbz", "jpg", "png", "jpeg" };
            var extension = Path.GetExtension(archivo.FileName).ToLower().TrimStart('.');

            if (!formatosPermitidos.Contains(extension))
            {
                return BadRequest(new { mensaje = "Formato no permitido. Usa PDF, CBZ o imágenes." });
            }

            // 🔹 Guardar el archivo en el servidor
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
            // 🔹 Verificar si el directorio wwwroot/uploads existe
            var uploadF = _environment.WebRootPath;
            if (string.IsNullOrEmpty(uploadF))
            {
                uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            }

            var uploadsPath = Path.Combine(uploadsFolder, "uploads");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var filePath = Path.Combine(uploadsFolder, archivo.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await archivo.CopyToAsync(stream);
            }

            // 🔹 Guardar el cómic en la base de datos
            var nuevoComic = new Comic
            {
                Titulo = titulo,
                Autor = autor,
                Formato = formato,
                RutaArchivo = "/uploads/" + archivo.FileName,
                FechaSubida = DateTime.UtcNow
            };
            if (archivo == null || archivo.Length == 0)
            {
                Console.WriteLine("❌ No se recibió el archivo correctamente.");
                return BadRequest(new { mensaje = "El archivo es obligatorio." });
            }
            Console.WriteLine($"✅ Archivo recibido: {archivo.FileName}, Tamaño: {archivo.Length} bytes");

            _context.comics.Add(nuevoComic);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComics), new { id = nuevoComic.Id }, new
            {
                mensaje = "Cómic subido correctamente.",
                comic = nuevoComic
            });
        }
        // 🔹 PUT: /api/comics/{id} -> Actualizar un cómic por su ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComic(int id, [FromBody] Comic comicUpdate)
        {
            if (comicUpdate == null)
            {
                return BadRequest(new { mensaje = "Los datos enviados no son válidos." });
            }

            var comic = await _context.comics.FindAsync(id);
            if (comic == null)
            {
                return NotFound(new { mensaje = $"No se encontró el cómic con ID {id}." });
            }

            // Actualizar solo los campos enviados en el JSON
            if (!string.IsNullOrEmpty(comicUpdate.Titulo)) comic.Titulo = comicUpdate.Titulo;
            if (!string.IsNullOrEmpty(comicUpdate.Autor)) comic.Autor = comicUpdate.Autor;
            if (!string.IsNullOrEmpty(comicUpdate.Formato)) comic.Formato = comicUpdate.Formato;
            if (!string.IsNullOrEmpty(comicUpdate.RutaArchivo)) comic.RutaArchivo = comicUpdate.RutaArchivo;

            _context.comics.Update(comic);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = $"El cómic con ID {id} ha sido actualizado correctamente." });
        }

        // 🔹 DELETE : /api/comics/{id} -> Borra un cómic por su ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComic(int id)
        {
            var comic = await _context.comics.FindAsync(id);

            if (comic == null)
            {
                return NotFound(new { mensaje = $"No se encontró el cómic con ID {id}." });
            }

            _context.comics.Remove(comic);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = $"El cómic con ID {id} ha sido eliminado correctamente." });
        }

    }
}


// Ya con esto podemos probar nuestra API en el navegador con la ruta http://localhost:5115/api/comics con postman