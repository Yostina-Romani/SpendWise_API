using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpendWise.Migrations
{
    /// <inheritdoc />
    public partial class init1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "category",
                columns: table => new
                {
                    categoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    categoryName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_category", x => x.categoryID);
                });

            migrationBuilder.CreateTable(
                name: "expense",
                columns: table => new
                {
                    expenseId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    expenseAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    expenseTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CategoryId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_expense", x => x.expenseId);
                    table.ForeignKey(
                        name: "FK_expense_category_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "category",
                        principalColumn: "categoryID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_expense_CategoryId",
                table: "expense",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "expense");

            migrationBuilder.DropTable(
                name: "category");
        }
    }
}
