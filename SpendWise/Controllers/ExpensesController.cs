using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SpendWise.Models;
using SpendWise.DTOS;
using SpendWise.Data;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
namespace SpendWise.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public  class ExpensesController : ControllerBase
    {
        private readonly dbcontext _dbcont;
        private readonly UserManager<Applicationuser> _usermanager;

        public ExpensesController(dbcontext dbcont,UserManager<Applicationuser> userManager)
        {
            _dbcont = dbcont;
            _usermanager = userManager;
           

        }



        [Authorize]
        [HttpPost("addExpense")]

        public async Task <IActionResult> AddExpense(addExpenseDTO model)
        {
            var userID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
           
            if (userID == null)
            {
                return Unauthorized();
            }
            var mod = new Expenses {
                expenseTime = model.expenseTime,

                UserId = userID,
                expenseAmount = model.expenseAmount,
                categoryID = model.categoryID,
            };
          
            _dbcont.expense.Add(mod);

            await _dbcont.SaveChangesAsync();

            return Ok(new
            {
                massege="expense added successfully"
            });

        }

        [HttpGet("myExpenses")]
        [Authorize]
        public async Task<IActionResult>myExpenses()
        {
            var userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userid == null)
            {
                return BadRequest(new
                {
                    message = "not found"
                });

            }
            var expenses = await _dbcont.expense
                   .Where(e => e.UserId == userid)
                   .Select(e => new
                   {
                       e.expenseId,
                       e.expenseAmount,
                       e.expenseTime,

                       category = new
                       {
                           e.Category.categoryID,
                           e.Category.categoryNmae,
                           e.Category.imageURL
                       }
                   }).OrderByDescending(e => e.expenseTime).ToListAsync();
             
            return Ok(expenses);
        }

    }
}