using ComicReaderBackend.Data; // Importamos el contexto de base de datos
using Microsoft.EntityFrameworkCore; // Importamos Entity Framework Core

var builder = WebApplication.CreateBuilder(args);

// 🔹 Configurar la conexión con PostgreSQL (lee la cadena de conexión desde appsettings.json)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 🔹 Configurar Kestrel explícitamente para manejar certificados
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ConfigureHttpsDefaults(listenOptions =>
    {
        listenOptions.SslProtocols = System.Security.Authentication.SslProtocols.Tls12 | System.Security.Authentication.SslProtocols.Tls13;
    });
});

// 🔹 Agregar CORS para permitir solicitudes desde cualquier origen
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

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

// 🔹 Usar CORS antes de otros middleware
app.UseCors();

app.UseStaticFiles();
// 🔹 Habilitar redirección HTTPS
app.UseHttpsRedirection();
// 🔹 Habilitar autorización (en caso de que en el futuro agreguemos autenticación)
app.UseAuthorization();
// 🔹 Mapea automáticamente los controladores para que funcionen las rutas API
app.MapControllers();

// 🔹 NO agregar URLs aquí, ya están configuradas en appsettings.json
// app.Urls.Add("http://0.0.0.0:5000");
// app.Urls.Add("https://0.0.0.0:5001");

// 🔹 Inicia la aplicación
app.Run();