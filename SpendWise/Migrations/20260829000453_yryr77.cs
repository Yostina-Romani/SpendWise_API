using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpendWise.Migrations
{
    /// <inheritdoc />
    public partial class yryr77 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_expense_category_CategoryId",
                table: "expense");

            migrationBuilder.DropColumn(
                name: "categoryName",
                table: "category");

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                table: "expense",
                newName: "categoryID");

            migrationBuilder.RenameIndex(
                name: "IX_expense_CategoryId",
                table: "expense",
                newName: "IX_expense_categoryID");

            migrationBuilder.AddColumn<string>(
                name: "CategoryDescription",
                table: "category",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "categoryNmae",
                table: "category",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_expense_category_categoryID",
                table: "expense",
                column: "categoryID",
                principalTable: "category",
                principalColumn: "categoryID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_expense_category_categoryID",
                table: "expense");

            migrationBuilder.DropColumn(
                name: "CategoryDescription",
                table: "category");

            migrationBuilder.DropColumn(
                name: "categoryNmae",
                table: "category");

            migrationBuilder.RenameColumn(
                name: "categoryID",
                table: "expense",
                newName: "CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_expense_categoryID",
                table: "expense",
                newName: "IX_expense_CategoryId");

            migrationBuilder.AddColumn<string>(
                name: "categoryName",
                table: "category",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_expense_category_CategoryId",
                table: "expense",
                column: "CategoryId",
                principalTable: "category",
                principalColumn: "categoryID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
