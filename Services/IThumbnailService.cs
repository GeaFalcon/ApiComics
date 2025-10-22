namespace ComicReaderBackend.Services
{
    public interface IThumbnailService
    {
        Task<string?> GenerateThumbnailAsync(string filePath, string formato);
    }
}
