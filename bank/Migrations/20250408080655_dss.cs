using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace bank.Migrations
{
    /// <inheritdoc />
    public partial class dss : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Accountsid",
                table: "Transactions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UsersId",
                table: "Accounts",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_Accountsid",
                table: "Transactions",
                column: "Accountsid");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_UsersId",
                table: "Accounts",
                column: "UsersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Accounts_Users_UsersId",
                table: "Accounts",
                column: "UsersId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Accounts_Accountsid",
                table: "Transactions",
                column: "Accountsid",
                principalTable: "Accounts",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Accounts_Users_UsersId",
                table: "Accounts");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Accounts_Accountsid",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_Accountsid",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Accounts_UsersId",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "Accountsid",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "UsersId",
                table: "Accounts");
        }
    }
}
