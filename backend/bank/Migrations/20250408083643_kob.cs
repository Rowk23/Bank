using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace bank.Migrations
{
    /// <inheritdoc />
    public partial class kob : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Accounts_Users_UsersId",
                table: "Accounts");

            migrationBuilder.RenameColumn(
                name: "TO",
                table: "Transactions",
                newName: "Accountsid");

            migrationBuilder.RenameColumn(
                name: "FROM",
                table: "Transactions",
                newName: "AccountsTO");

            migrationBuilder.AddColumn<int>(
                name: "AccountsFROM",
                table: "Transactions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "UsersId",
                table: "Accounts",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_Accountsid",
                table: "Transactions",
                column: "Accountsid");

            migrationBuilder.AddForeignKey(
                name: "FK_Accounts_Users_UsersId",
                table: "Accounts",
                column: "UsersId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Accounts_Accountsid",
                table: "Transactions",
                column: "Accountsid",
                principalTable: "Accounts",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
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

            migrationBuilder.DropColumn(
                name: "AccountsFROM",
                table: "Transactions");

            migrationBuilder.RenameColumn(
                name: "Accountsid",
                table: "Transactions",
                newName: "TO");

            migrationBuilder.RenameColumn(
                name: "AccountsTO",
                table: "Transactions",
                newName: "FROM");

            migrationBuilder.AlterColumn<int>(
                name: "UsersId",
                table: "Accounts",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Accounts_Users_UsersId",
                table: "Accounts",
                column: "UsersId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
