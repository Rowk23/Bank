using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace bank.Migrations
{
    /// <inheritdoc />
    public partial class diusaid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Accounts_AccountIdid",
                table: "Cards");

            migrationBuilder.RenameColumn(
                name: "AccountIdid",
                table: "Cards",
                newName: "AccountsId");

            migrationBuilder.RenameIndex(
                name: "IX_Cards_AccountIdid",
                table: "Cards",
                newName: "IX_Cards_AccountsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Accounts_AccountsId",
                table: "Cards",
                column: "AccountsId",
                principalTable: "Accounts",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Accounts_AccountsId",
                table: "Cards");

            migrationBuilder.RenameColumn(
                name: "AccountsId",
                table: "Cards",
                newName: "AccountIdid");

            migrationBuilder.RenameIndex(
                name: "IX_Cards_AccountsId",
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
    }
}
