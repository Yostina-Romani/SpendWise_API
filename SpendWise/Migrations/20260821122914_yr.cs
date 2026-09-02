using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpendWise.Migrations
{
    /// <inheritdoc />
    public partial class yr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_expense_category_CategoryId",
                table: "expense");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "expense",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "expense",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "categoryName",
                table: "category",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddForeignKey(
                name: "FK_expense_category_CategoryId",
                table: "expense",
                column: "CategoryId",
                principalTable: "category",
                principalColumn: "categoryID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_expense_category_CategoryId",
                table: "expense");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "expense",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "expense",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "categoryName",
                table: "category",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AddForeignKey(
                name: "FK_expense_category_CategoryId",
                table: "expense",
                column: "CategoryId",
                principalTable: "category",
                principalColumn: "categoryID");
        }
    }
}
