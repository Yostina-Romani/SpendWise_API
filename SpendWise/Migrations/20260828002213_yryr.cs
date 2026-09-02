using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpendWise.Migrations
{
    /// <inheritdoc />
    public partial class yryr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "expense",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_expense_UserId",
                table: "expense",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_expense_AspNetUsers_UserId",
                table: "expense",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_expense_AspNetUsers_UserId",
                table: "expense");

            migrationBuilder.DropIndex(
                name: "IX_expense_UserId",
                table: "expense");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "expense",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
