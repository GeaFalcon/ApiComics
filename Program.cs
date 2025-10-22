using ComicReaderBackend.Data;
using ComicReaderBackend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configurar la conexión con PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configurar servicios
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IThumbnailService, ThumbnailService>();

// Configurar JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey no configurada.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Configurar Kestrel explícitamente para manejar certificados y archivos grandes
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    // Permitir archivos de hasta 200MB
    serverOptions.Limits.MaxRequestBodySize = 200 * 1024 * 1024; // 200MB

    serverOptions.ConfigureHttpsDefaults(listenOptions =>
    {
        listenOptions.SslProtocols = System.Security.Authentication.SslProtocols.Tls12 | System.Security.Authentication.SslProtocols.Tls13;
    });
});

// Agregar CORS para permitir solicitudes desde cualquier origen
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

// Configurar FormOptions para permitir archivos grandes
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 200 * 1024 * 1024; // 200MB
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartHeadersLengthLimit = int.MaxValue;
});

// Agregar los controladores para manejar rutas API
builder.Services.AddControllers();

// Configurar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<IWebHostEnvironment>(builder.Environment);

var app = builder.Build();

// 🔹 Inicializar base de datos automáticamente (migraciones + usuario admin)
await DbInitializer.InitializeAsync(app.Services);

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

// Usar CORS antes de otros middleware
app.UseCors();

app.UseStaticFiles();

// Habilitar autenticación y autorización
app.UseAuthentication();
app.UseAuthorization();

// Mapea automáticamente los controladores para que funcionen las rutas API
app.MapControllers();

// 🔹 Servir index.html por defecto en la ruta raíz
app.MapFallbackToFile("index.html");

// 🔹 NO agregar URLs aquí, ya están configuradas en appsettings.json
// app.Urls.Add("http://0.0.0.0:5000");
// app.Urls.Add("https://0.0.0.0:5001");

// 🔹 Inicia la aplicación
app.Run();