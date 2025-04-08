// Importa la librería de Entity Framework Core, que nos permite trabajar con bases de datos de manera sencilla
using Microsoft.EntityFrameworkCore; 

// Importa los modelos de datos, es decir, las definiciones de las clases que representan las tablas de la base de datos.
// En este caso, se usará el modelo "Comic" que se define en otro archivo.
using ComicReaderBackend.Models; 

// Define un "espacio de nombres" que ayuda a organizar el código. Aquí se agrupan todas las clases relacionadas con los datos.
namespace ComicReaderBackend.Data 
{
    // Esta clase se llama ApplicationDbContext y hereda de DbContext.
    // Una "clase de contexto" es como una puerta de entrada a la base de datos, que nos permite leer y guardar datos.
    public class ApplicationDbContext : DbContext
    {
        // Este es el constructor de la clase. 
        // Recibe unas "opciones" que configuran cómo conectarse a la base de datos (por ejemplo, la dirección de la base, usuario, etc.).
        // El ": base(options)" significa que estas opciones se pasan a la clase base (DbContext) para que sepa cómo conectarse.
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Esta propiedad define una "tabla" en la base de datos.
        // Aquí se crea una colección de objetos del tipo "Comic", y cada objeto se representa como una fila en la tabla.
        // Gracias a esto, podemos usar el código para agregar, leer, actualizar o borrar registros en la tabla "Comics".
        public DbSet<Comic> comics { get; set; }
        public DbSet<Loggin> users { get; set; }
    }
}
