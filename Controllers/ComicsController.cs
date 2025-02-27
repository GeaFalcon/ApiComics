using Microsoft.AspNetCore.Mvc;
using ComicReaderBackend.Data;
using ComicReaderBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace ComicReaderBackend.Controllers
{
    [Route("api/comics")] // 🔹 La ruta base será /api/comics
    [ApiController]
    public class ComicsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // 🔹 Inyectamos la base de datos en el controlador
        public ComicsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🔹 Endpoint GET para obtener todos los cómics
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Comic>>> GetComics()
        {
        var comics = await _context.comics.ToListAsync();
        
        Console.WriteLine($"🔍 Cantidad de cómics encontrados: {comics.Count}");
        
        return Ok(comics);
    
        }
        [HttpPost("upload")]
        public async Task<ActionResult<Comic>> UploadComic([FromBody] Comic comic)
        {
            if (comic == null)
            {
                return BadRequest("El cómic no puede ser nulo.");
            }

            _context.comics.Add(comic);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComics), new { id = comic.Id }, comic);
        }
    }
}


// Ya con esto podemos probar nuestra API en el navegador con la ruta http://localhost:5000/api/comics con postman