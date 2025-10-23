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

                // Verificar si hay migraciones aplicadas o pendientes
                var appliedMigrations = await context.Database.GetAppliedMigrationsAsync();
                var pendingMigrations = await context.Database.GetPendingMigrationsAsync();

                // Si no hay migraciones aplicadas ni pendientes, usar EnsureCreated
                if (!appliedMigrations.Any() && !pendingMigrations.Any())
                {
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
                else if (pendingMigrations.Any())
                {
                    // Hay migraciones pendientes, aplicarlas
                    logger.LogInformation($"📦 Aplicando {pendingMigrations.Count()} migraciones pendientes...");
                    await context.Database.MigrateAsync();
                    logger.LogInformation("✅ Migraciones aplicadas correctamente");
                }
                else
                {
                    // Hay migraciones aplicadas pero no pendientes
                    logger.LogInformation("✅ Base de datos ya está actualizada");
                }

                // Crear usuario administrador por defecto si no existe
                await CreateDefaultAdminAsync(context, logger);

                // Aplicar ajustes al esquema si es necesario (para bases de datos creadas con EnsureCreated)
                await ApplySchemaFixesAsync(context, logger);

                logger.LogInformation("✅ Base de datos configurada correctamente");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "❌ Error al inicializar la base de datos");
                throw;
            }
        }

        private static async Task ApplySchemaFixesAsync(ApplicationDbContext context, ILogger logger)
        {
            try
            {
                // Verificar si la columna RutaMiniatura existe en la tabla Comics
                var connectionString = context.Database.GetConnectionString();
                await using var connection = context.Database.GetDbConnection();
                await connection.OpenAsync();

                await using var command = connection.CreateCommand();
                command.CommandText = @"
                    SELECT COUNT(*)
                    FROM information_schema.columns
                    WHERE table_name = 'comics'
                    AND column_name = 'RutaMiniatura';";

                var result = await command.ExecuteScalarAsync();
                var columnExists = Convert.ToInt32(result) > 0;

                if (!columnExists)
                {
                    logger.LogInformation("📦 Agregando columna RutaMiniatura a la tabla Comics...");

                    await using var alterCommand = connection.CreateCommand();
                    alterCommand.CommandText = @"
                        ALTER TABLE ""Comics""
                        ADD COLUMN ""RutaMiniatura"" character varying(500) NULL;";

                    await alterCommand.ExecuteNonQueryAsync();
                    logger.LogInformation("✅ Columna RutaMiniatura agregada correctamente");
                }
                else
                {
                    logger.LogInformation("ℹ️  La columna RutaMiniatura ya existe en la tabla Comics");
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "⚠️  No se pudo verificar/agregar la columna RutaMiniatura (puede que ya exista o la tabla no exista aún)");
                // No lanzamos excepción porque esto no debe detener la inicialización
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
