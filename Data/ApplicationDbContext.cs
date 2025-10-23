using Microsoft.EntityFrameworkCore;
using ComicReaderBackend.Models;

namespace ComicReaderBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Tablas principales
        public DbSet<User> Users { get; set; }
        public DbSet<Comic> Comics { get; set; }
        public DbSet<Serie> Series { get; set; }

        // Tablas de relaciones
        public DbSet<Favorito> Favoritos { get; set; }
        public DbSet<Voto> Votos { get; set; }
        public DbSet<HistorialLectura> HistorialLecturas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar índices únicos para evitar duplicados
            modelBuilder.Entity<Favorito>()
                .HasIndex(f => new { f.UserId, f.ComicId })
                .IsUnique();

            modelBuilder.Entity<Voto>()
                .HasIndex(v => new { v.UserId, v.ComicId })
                .IsUnique();

            // Configurar relaciones para evitar ciclos de eliminación en cascada
            modelBuilder.Entity<Comic>()
                .HasOne(c => c.SubidoPor)
                .WithMany(u => u.ComicsSubidos)
                .HasForeignKey(c => c.SubidoPorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Comic>()
                .HasOne(c => c.AprobadoPor)
                .WithMany()
                .HasForeignKey(c => c.AprobadoPorId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configurar relación Serie -> Comics
            modelBuilder.Entity<Comic>()
                .HasOne(c => c.Serie)
                .WithMany(s => s.Comics)
                .HasForeignKey(c => c.SerieId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configurar relación Serie -> Usuario
            modelBuilder.Entity<Serie>()
                .HasOne(s => s.CreadoPor)
                .WithMany()
                .HasForeignKey(s => s.CreadoPorId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
