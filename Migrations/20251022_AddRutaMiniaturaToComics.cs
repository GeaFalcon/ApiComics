using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ComicReaderBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddRutaMiniaturaToComics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RutaMiniatura",
                table: "Comics",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RutaMiniatura",
                table: "Comics");
        }
    }
}
