using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace bank.Migrations
{
    /// <inheritdoc />
    public partial class aaaaa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Accounts_Accounts",
                table: "Cards");

            migrationBuilder.RenameColumn(
                name: "Accounts",
                table: "Cards",
                newName: "AccountIdid");

            migrationBuilder.RenameIndex(
                name: "IX_Cards_Accounts",
                table: "Cards",
                newName: "IX_Cards_AccountIdid");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Accounts_AccountIdid",
                table: "Cards",
                column: "AccountIdid",
                principalTable: "Accounts",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Accounts_AccountIdid",
                table: "Cards");

            migrationBuilder.RenameColumn(
                name: "AccountIdid",
                table: "Cards",
                newName: "Accounts");

            migrationBuilder.RenameIndex(
                name: "IX_Cards_AccountIdid",
                table: "Cards",
                newName: "IX_Cards_Accounts");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Accounts_Accounts",
                table: "Cards",
                column: "Accounts",
                principalTable: "Accounts",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
