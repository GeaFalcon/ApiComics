using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ComicReaderBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddSeriesSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Crear tabla Series
            migrationBuilder.CreateTable(
                name: "Series",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Titulo = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Autor = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Descripcion = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    RutaPortada = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Genero = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Estado = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    AnoPublicacion = table.Column<int>(type: "integer", nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreadoPorId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Series", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Series_Users_CreadoPorId",
                        column: x => x.CreadoPorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            // Añadir columnas a Comics
            migrationBuilder.AddColumn<int>(
                name: "SerieId",
                table: "Comics",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NumeroCapitulo",
                table: "Comics",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NumeroVolumen",
                table: "Comics",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TituloCapitulo",
                table: "Comics",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            // Crear foreign key de Comics a Series
            migrationBuilder.CreateIndex(
                name: "IX_Comics_SerieId",
                table: "Comics",
                column: "SerieId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comics_Series_SerieId",
                table: "Comics",
                column: "SerieId",
                principalTable: "Series",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            // Crear índice para CreadoPorId en Series
            migrationBuilder.CreateIndex(
                name: "IX_Series_CreadoPorId",
                table: "Series",
                column: "CreadoPorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Eliminar foreign key y columnas de Comics
            migrationBuilder.DropForeignKey(
                name: "FK_Comics_Series_SerieId",
                table: "Comics");

            migrationBuilder.DropIndex(
                name: "IX_Comics_SerieId",
                table: "Comics");

            migrationBuilder.DropColumn(
                name: "SerieId",
                table: "Comics");

            migrationBuilder.DropColumn(
                name: "NumeroCapitulo",
                table: "Comics");

            migrationBuilder.DropColumn(
                name: "NumeroVolumen",
                table: "Comics");

            migrationBuilder.DropColumn(
                name: "TituloCapitulo",
                table: "Comics");

            // Eliminar tabla Series
            migrationBuilder.DropTable(
                name: "Series");
        }
    }
}
