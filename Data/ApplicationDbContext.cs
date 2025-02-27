using Microsoft.EntityFrameworkCore; //Importa la librería de Entity Framework Core
using ComicReaderBackend.Models; //Importa el modelo de datos "Comic"

namespace ComicReaderBackend.Data //Define el espacio de nombres de la clase
{
    //Esta clase representa la base de datos y sus tablas 
    public class ApplicationDbContext : DbContext
    {
        //El constructor recibe las opciones de configuracion de la BD
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options){}
        //Definimos la que la tabla "Comics" se mapeara a la base de datos 
        public DbSet<Comic> comics { get; set; } //Define una propiedad para acceder a la tabla "Comics"
    }
    
}