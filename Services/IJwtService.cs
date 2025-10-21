using ComicReaderBackend.Models;

namespace ComicReaderBackend.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
