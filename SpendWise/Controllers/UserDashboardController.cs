using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using SpendWise.Data;
using SpendWise.Models;
using System.Security.Claims;

namespace SpendWise.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserDashboardController : ControllerBase
    {
        private readonly UserManager<Applicationuser> _usermanager;
        private readonly dbcontext _dbcontext;
        public UserDashboardController(UserManager<Applicationuser> userManager,dbcontext dbcontext)
        {
            _usermanager = userManager;
            _dbcontext= dbcontext;
        }
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> daashboard()
        {
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _usermanager.FindByIdAsync(userId!);
            if (user == null)
            {
                return NotFound();
            }
            var month = DateTime.Now.Month;
            var year = DateTime.Now.Year;

            var expenses = await _dbcontext.expense.Include(e=>e.Category).Where(e => e.UserId == userId).ToListAsync();
            var totalExpenses = expenses.Sum(e => e.expenseAmount);
            var monthlyExpense = await _dbcontext.expense.Where(e => e.expenseTime.Year == year && e.expenseTime.Month == month && e.UserId == userId).SumAsync(e=>e.expenseAmount);

            var incomes =await _dbcontext.income.Where(i => i.UserId == userId).ToListAsync();
            var totalIncome = incomes.Sum(i => i.Amount);

            var balance = totalIncome - totalExpenses;

        
            var budget = await _dbcontext.budget.FirstOrDefaultAsync(b => b.Year == year && b.Month == month&& b.UserId==userId);
            var monthlyBudget = budget?.Amount ?? 0;

            var remaining = monthlyBudget - monthlyExpense;

            var budgetPercentage = monthlyBudget > 0 ? (100 - (monthlyExpense / monthlyBudget)*100) :0;


            //recent expenses
            var recentExpenses = expenses.OrderByDescending(e => e.expenseTime).Take(5).Select(e => new
            {
                expenseid = e.expenseId,
                expenseamount = e.expenseAmount,
                expenseTime = e.expenseTime,
                category = e.Category != null ? e.Category.categoryNmae : "unKnown" ,
                categoryUrl=e.Category!=null?e.Category.imageURL:null
                
            }).ToList();


            var categoryBreakdown = expenses.GroupBy(e => new
            {
                e.categoryID,
                categoeyNamw = e.Category != null ? e.Category.categoryNmae : "unKown"
            }).Select(g => new
            {
                categoryId = g.Key.categoryID,
                categoryName = g.Key.categoeyNamw,
                totalAmount = g.Sum(e => e.expenseAmount)
            }).OrderByDescending(x => x.totalAmount).ToList();

            return Ok(new
            {
                user = new
                {
                    id=user.Id,
                    name=user.name,
                    email=user.Email
                },
                summary = new
                {   totalIncome,
                    totalExpenses,
                    balance
                },
                budget = new
                {
                    monthlyBudget,
                    monthlyExpense,
                    remaining,
                    budgetPercentage
                },
                categoryBreakdown,
                recentExpenses
            });
        }
    }
}
