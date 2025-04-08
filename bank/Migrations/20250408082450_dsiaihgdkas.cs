using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace bank.Migrations
{
    /// <inheritdoc />
    public partial class dsiaihgdkas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Accounts_accountsid",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "accountId",
                table: "Cards");

            migrationBuilder.RenameColumn(
                name: "accountsid",
                table: "Cards",
                newName: "Accounts");

            migrationBuilder.RenameIndex(
                name: "IX_Cards_accountsid",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Accounts_Accounts",
                table: "Cards");

            migrationBuilder.RenameColumn(
                name: "Accounts",
                table: "Cards",
                newName: "accountsid");

            migrationBuilder.RenameIndex(
                name: "IX_Cards_Accounts",
                table: "Cards",
                newName: "IX_Cards_accountsid");

            migrationBuilder.AddColumn<int>(
                name: "accountId",
                table: "Cards",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Accounts_accountsid",
                table: "Cards",
                column: "accountsid",
                principalTable: "Accounts",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
