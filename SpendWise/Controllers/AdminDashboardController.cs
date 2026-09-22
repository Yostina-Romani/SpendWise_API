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
            // ==========================================
            // CURRENT DATE
            // ==========================================

            var currentDate = DateTime.Now;

            var currentMonth = currentDate.Month;
            var currentYear = currentDate.Year;


            // ==========================================
            // USERS
            // ==========================================

            var totalUsers =
                await _userManager.Users.CountAsync();


            // ==========================================
            // CATEGORIES
            // ==========================================

            var totalCategories =
                await _dbContext.category.CountAsync();


            // ==========================================
            // EXPENSES
            // ==========================================

            var totalExpenses =
                await _dbContext.expense.CountAsync();

            var totalExpenseAmount =
                await _dbContext.expense
                    .SumAsync(e => (decimal?)e.expenseAmount)
                    ?? 0;


            // ==========================================
            // INCOME
            // ==========================================

            var totalIncome =
                await _dbContext.income.CountAsync();

            var totalIncomeAmount =
                await _dbContext.income
                    .SumAsync(i => (decimal?)i.Amount)
                    ?? 0;


            // ==========================================
            // CURRENT MONTH EXPENSES
            // ==========================================

            var monthlyExpensesQuery =
                _dbContext.expense
                    .Where(e =>
                        e.expenseTime.Month == currentMonth &&
                        e.expenseTime.Year == currentYear);


            var monthlyExpenseCount =
                await monthlyExpensesQuery.CountAsync();


            var monthlyExpenseAmount =
                await monthlyExpensesQuery
                    .SumAsync(e => (decimal?)e.expenseAmount)
                    ?? 0;


            // ==========================================
            // CURRENT MONTH INCOME
            // ==========================================

            var monthlyIncomeQuery =
                _dbContext.income
                    .Where(i =>
                        i.IncomeTime.Month == currentMonth &&
                        i.IncomeTime.Year == currentYear);


            var monthlyIncomeCount =
                await monthlyIncomeQuery.CountAsync();


            var monthlyIncomeAmount =
                await monthlyIncomeQuery
                    .SumAsync(i => (decimal?)i.Amount)
                    ?? 0;


            // ==========================================
            // CURRENT MONTH BUDGET
            // ==========================================

            var budget =
                await _dbContext.budget
                    .FirstOrDefaultAsync(b =>
                        b.Month == currentMonth &&
                        b.Year == currentYear);


            var monthlyBudget =
                budget?.Amount ?? 0;


            var remainingBudget =
                monthlyBudget -
                monthlyExpenseAmount;


            var budgetUsedPercentage =
                monthlyBudget > 0
                    ? (monthlyExpenseAmount / monthlyBudget) * 100
                    : 0;


            // ==========================================
            // BALANCE
            // ==========================================

            var balance =
                totalIncomeAmount -
                totalExpenseAmount;


            var monthlyBalance =
                monthlyIncomeAmount -
                monthlyExpenseAmount;


            // ==========================================
            // RECENT EXPENSES
            // ==========================================

            var recentExpenses =
                await _dbContext.expense
                    .Include(e => e.Category)
                    .OrderByDescending(e => e.expenseTime)
                    .Take(5)
                    .Select(e => new
                    {
                        expenseId = e.expenseId,

                        expenseAmount =
                            e.expenseAmount,

                        expenseTime =
                            e.expenseTime,

                        category =
                            e.Category == null
                                ? null
                                : new
                                {
                                    categoryID =
                                        e.Category.categoryID,

                                    categoryNmae =
                                        e.Category.categoryNmae,

                                    imageURL =
                                        e.Category.imageURL
                                }
                    })
                    .ToListAsync();


            // ==========================================
            // RESPONSE
            // ==========================================

            return Ok(new
            {
                admin = new
                {
                    message = "Admin Dashboard"
                },

                summary = new
                {
                    totalUsers,

                    totalCategories,

                    totalExpenses,

                    totalExpenseAmount,

                    totalIncome,

                    totalIncomeAmount,

                    balance
                },

                overview = new
                {
                    income =
                        totalIncomeAmount,

                    expenses =
                        totalExpenseAmount,

                    balance,

                    expenseRatio =
                        totalIncomeAmount > 0
                            ? (totalExpenseAmount /
                               totalIncomeAmount) * 100
                            : 0
                },

                budget = new
                {
                    monthlyBudget,

                    monthlyExpenses =
                        monthlyExpenseAmount,

                    remaining =
                        remainingBudget,

                    usedPercentage =
                        Math.Min(
                            100,
                            Math.Max(
                                0,
                                budgetUsedPercentage
                            )
                        )
                },

                currentMonth = new
                {
                    month =
                        currentMonth,

                    year =
                        currentYear,

                    expenseCount =
                        monthlyExpenseCount,

                    expenseAmount =
                        monthlyExpenseAmount,

                    incomeCount =
                        monthlyIncomeCount,

                    incomeAmount =
                        monthlyIncomeAmount,

                    balance =
                        monthlyBalance
                },

                recentExpenses
            });
        }
    }
}