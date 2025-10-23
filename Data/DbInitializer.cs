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

                // Verificar si la base de datos existe
                var canConnect = await context.Database.CanConnectAsync();

                if (!canConnect)
                {
                    logger.LogInformation("📦 Base de datos no existe. Creando con migraciones...");
                    await context.Database.MigrateAsync();
                    logger.LogInformation("✅ Base de datos creada correctamente");
                }
                else
                {
                    // La base de datos existe, verificar migraciones
                    var appliedMigrations = await context.Database.GetAppliedMigrationsAsync();
                    var pendingMigrations = await context.Database.GetPendingMigrationsAsync();

                    // Si no hay migraciones aplicadas pero hay pendientes (BD creada con EnsureCreated)
                    if (!appliedMigrations.Any() && pendingMigrations.Any())
                    {
                        logger.LogWarning("⚠️  Base de datos creada sin migraciones. Eliminando y recreando con migraciones...");
                        await context.Database.EnsureDeletedAsync();
                        await context.Database.MigrateAsync();
                        logger.LogInformation("✅ Base de datos recreada con migraciones");
                    }
                    else if (pendingMigrations.Any())
                    {
                        // Hay migraciones pendientes, aplicarlas
                        logger.LogInformation($"📦 Aplicando {pendingMigrations.Count()} migraciones pendientes...");
                        await context.Database.MigrateAsync();
                        logger.LogInformation("✅ Migraciones aplicadas correctamente");
                    }
                    else
                    {
                        // Base de datos actualizada
                        logger.LogInformation("✅ Base de datos ya está actualizada");
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
