using ComicReaderBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace ComicReaderBackend.Data
{
    public class DbInitializer
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<DbInitializer>>();

            try
            {
                logger.LogInformation("🔄 Iniciando configuración de base de datos...");

                // Intentar aplicar migraciones si existen, si no, usar EnsureCreated
                try
                {
                    var pendingMigrations = await context.Database.GetPendingMigrationsAsync();
                    if (pendingMigrations.Any())
                    {
                        logger.LogInformation("📦 Aplicando migraciones pendientes...");
                        await context.Database.MigrateAsync();
                        logger.LogInformation("✅ Migraciones aplicadas correctamente");
                    }
                    else
                    {
                        // Intentar migrar de todas formas (aplica cualquier migración existente)
                        await context.Database.MigrateAsync();
                        logger.LogInformation("✅ Base de datos actualizada");
                    }
                }
                catch (InvalidOperationException)
                {
                    // No hay migraciones configuradas, usar EnsureCreated
                    logger.LogInformation("📦 No hay migraciones configuradas. Usando EnsureCreated...");
                    var created = await context.Database.EnsureCreatedAsync();
                    if (created)
                    {
                        logger.LogInformation("✅ Base de datos y tablas creadas correctamente");
                    }
                    else
                    {
                        logger.LogInformation("ℹ️  La base de datos ya existe");
                    }
                }

                // Crear usuario administrador por defecto si no existe
                await CreateDefaultAdminAsync(context, logger);

                logger.LogInformation("✅ Base de datos configurada correctamente");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "❌ Error al inicializar la base de datos");
                throw;
            }
        }

        private static async Task CreateDefaultAdminAsync(ApplicationDbContext context, ILogger logger)
        {
            const string defaultAdminUsername = "admin";
            const string defaultAdminEmail = "admin@comicreader.com";
            const string defaultAdminPassword = "Admin123!";

            try
            {
                var adminExists = await context.Users.AnyAsync(u => u.Role == "Admin");

                if (!adminExists)
                {
                    logger.LogInformation("👤 Creando usuario administrador por defecto...");

                    var adminUser = new User
                    {
                        Username = defaultAdminUsername,
                        Email = defaultAdminEmail,
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword(defaultAdminPassword),
                        Role = "Admin",
                        FechaRegistro = DateTime.UtcNow
                    };

                    context.Users.Add(adminUser);
                    await context.SaveChangesAsync();

                    logger.LogInformation("✅ Usuario administrador creado:");
                    logger.LogInformation($"   👤 Usuario: {defaultAdminUsername}");
                    logger.LogInformation($"   📧 Email: {defaultAdminEmail}");
                    logger.LogInformation($"   🔑 Contraseña: {defaultAdminPassword}");
                    logger.LogWarning("⚠️  IMPORTANTE: Cambia la contraseña del administrador después del primer inicio de sesión");
                }
                else
                {
                    logger.LogInformation("ℹ️  Usuario administrador ya existe, omitiendo creación");
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "❌ Error al crear usuario administrador");
                throw;
            }
        }
    }
}
