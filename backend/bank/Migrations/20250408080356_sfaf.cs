using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace bank.Migrations
{
    /// <inheritdoc />
    public partial class sfaf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Accountsid",
                table: "Cards",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Accountsid",
                table: "Cards",
                column: "Accountsid");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Accounts_Accountsid",
                table: "Cards",
                column: "Accountsid",
                principalTable: "Accounts",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Accounts_Accountsid",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_Accountsid",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Accountsid",
                table: "Cards");
        }
    }
}
