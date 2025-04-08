using ComicReaderBackend.Data;
using ComicReaderBackend.Models;

namespace ComicReaderBackend.Controllers{

    [Route("auth")]
    [ApiController]

    public class UserController: ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _enviroment;
        public UserController(ApplicationDbContext context, IWebHostEnvironment _enviroment)
        {
            _context = context;
            _enviroment = _enviroment;
        }

    [HttpGet]

    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        var users = await _context.users.ToListAsync();

        UserController.WriteLine($"{users.Count} Usuarios");
        
        return Ok(users);

    }
    }
}
