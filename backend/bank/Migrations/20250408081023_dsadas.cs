using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace bank.Migrations
{
    /// <inheritdoc />
    public partial class dsadas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Accountsid1",
                table: "Transactions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_Accountsid1",
                table: "Transactions",
                column: "Accountsid1");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Accounts_Accountsid1",
                table: "Transactions",
                column: "Accountsid1",
                principalTable: "Accounts",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Accounts_Accountsid1",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_Accountsid1",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "Accountsid1",
                table: "Transactions");
        }
    }
}
