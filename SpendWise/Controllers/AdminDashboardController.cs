using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpendWise.Data;
using SpendWise.Models;

namespace SpendWise.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminDashboardController : ControllerBase
    {
        private readonly dbcontext _dbContext;
        private readonly UserManager<Applicationuser> _userManager;

        public AdminDashboardController(
            dbcontext dbContext,
            UserManager<Applicationuser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;

            // =========================
            // Users
            // =========================

            var totalUsers = await _userManager.Users.CountAsync();

            // =========================
            // Categories
            // =========================

            var totalCategories =
                await _dbContext.category.CountAsync();

            // =========================
            // Expenses
            // =========================

            var totalExpenses =
                await _dbContext.expense.CountAsync();

            var totalExpenseAmount =
                await _dbContext.expense
                    .SumAsync(e => (decimal?)e.expenseAmount) ?? 0;

            // =========================
            // Current Month Expenses
            // =========================

            var monthlyExpensesQuery =
                _dbContext.expense
                    .Where(e =>
                        e.expenseTime.Month == currentMonth &&
                        e.expenseTime.Year == currentYear);

            var monthlyExpenseCount =
                await monthlyExpensesQuery.CountAsync();

            var monthlyExpenseAmount =
                await monthlyExpensesQuery
                    .SumAsync(e => (decimal?)e.expenseAmount) ?? 0;

            // =========================
            // Response
            // =========================

            return Ok(new
            {
                users = new
                {
                    totalUsers
                },

                categories = new
                {
                    totalCategories
                },

                expenses = new
                {
                    totalExpenses,
                    totalExpenseAmount
                },

                currentMonth = new
                {
                    month = currentMonth,
                    year = currentYear,
                    expenseCount = monthlyExpenseCount,
                    expenseAmount = monthlyExpenseAmount
                }
            });
        }
    }
}