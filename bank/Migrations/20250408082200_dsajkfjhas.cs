using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace bank.Migrations
{
    /// <inheritdoc />
    public partial class dsajkfjhas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Accounts_Accountsid",
                table: "Cards");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Accounts_Accountsid",
                table: "Transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Accounts_Accountsid1",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_Accountsid",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_Accountsid1",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "Accountsid",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "Accountsid1",
                table: "Transactions");

            migrationBuilder.RenameColumn(
                name: "Accountsid",
                table: "Cards",
                newName: "accountsid");

            migrationBuilder.RenameIndex(
                name: "IX_Cards_Accountsid",
                table: "Cards",
                newName: "IX_Cards_accountsid");

            migrationBuilder.AlterColumn<int>(
                name: "accountsid",
                table: "Cards",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Accounts_accountsid",
                table: "Cards",
                column: "accountsid",
                principalTable: "Accounts",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Accounts_accountsid",
                table: "Cards");

            migrationBuilder.RenameColumn(
                name: "accountsid",
                table: "Cards",
                newName: "Accountsid");

            migrationBuilder.RenameIndex(
                name: "IX_Cards_accountsid",
                table: "Cards",
                newName: "IX_Cards_Accountsid");

            migrationBuilder.AddColumn<int>(
                name: "Accountsid",
                table: "Transactions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Accountsid1",
                table: "Transactions",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Accountsid",
                table: "Cards",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_Accountsid",
                table: "Transactions",
                column: "Accountsid");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_Accountsid1",
                table: "Transactions",
                column: "Accountsid1");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Accounts_Accountsid",
                table: "Cards",
                column: "Accountsid",
                principalTable: "Accounts",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Accounts_Accountsid",
                table: "Transactions",
                column: "Accountsid",
                principalTable: "Accounts",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Accounts_Accountsid1",
                table: "Transactions",
                column: "Accountsid1",
                principalTable: "Accounts",
                principalColumn: "id");
        }
    }
}
