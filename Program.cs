using ComicReaderBackend.Data; // Importamos el contexto de base de datos
using Microsoft.EntityFrameworkCore; // Importamos Entity Framework Core

var builder = WebApplication.CreateBuilder(args);

// 🔹 Configurar la conexión con PostgreSQL (lee la cadena de conexión desde appsettings.json)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
// 🔹 Agregar los controladores para manejar rutas API
builder.Services.AddControllers();
// 🔹 Configurar Swagger solo si estamos en modo desarrollo
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<IWebHostEnvironment>(builder.Environment);

var app = builder.Build();
var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
if (!Directory.Exists(wwwrootPath))
{
    Directory.CreateDirectory(wwwrootPath);
}

// 🔹 Configurar el middleware de Swagger solo en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
// 🔹 Habilitar redirección HTTPS
app.UseHttpsRedirection();
// 🔹 Habilitar autorización (en caso de que en el futuro agreguemos autenticación)
app.UseAuthorization();
// 🔹 Mapea automáticamente los controladores para que funcionen las rutas API
app.MapControllers();
// 🔹 Inicia la aplicación
app.Run();
