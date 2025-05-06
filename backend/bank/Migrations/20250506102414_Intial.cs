using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace bank.Migrations
{
    /// <inheritdoc />
    public partial class Intial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    First_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Last_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CNP = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IBAN = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ownerId = table.Column<int>(type: "int", nullable: false),
                    currency = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    balance = table.Column<double>(type: "float", nullable: false),
                    UsersId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.id);
                    table.ForeignKey(
                        name: "FK_Accounts_Users_ownerId",
                        column: x => x.ownerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Cards",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    number = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    holderName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    expirationDate = table.Column<DateOnly>(type: "date", nullable: false),
                    CVV = table.Column<int>(type: "int", nullable: false),
                    AccountsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cards", x => x.id);
                    table.ForeignKey(
                        name: "FK_Cards_Accounts_AccountsId",
                        column: x => x.AccountsId,
                        principalTable: "Accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    identifier = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    amount = table.Column<double>(type: "float", nullable: false),
                    currency = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    time = table.Column<DateTime>(type: "datetime2", nullable: false),
                    type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FROMid = table.Column<int>(type: "int", nullable: false),
                    TOid = table.Column<int>(type: "int", nullable: false),
                    phone = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.id);
                    table.ForeignKey(
                        name: "FK_Transactions_Accounts_FROMid",
                        column: x => x.FROMid,
                        principalTable: "Accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Transactions_Accounts_TOid",
                        column: x => x.TOid,
                        principalTable: "Accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_ownerId",
                table: "Accounts",
                column: "ownerId");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_AccountsId",
                table: "Cards",
                column: "AccountsId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_FROMid",
                table: "Transactions",
                column: "FROMid");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_TOid",
                table: "Transactions",
                column: "TOid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Cards");

            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "Accounts");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
