using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SpendWise.Models;
using SpendWise.DTOS;
using SpendWise.Data;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
namespace SpendWise.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public  class ExpensesController : ControllerBase
    {
        private readonly dbcontext _dbcont;
        public ExpensesController(dbcontext dbcont)
        {
            _dbcont = dbcont;
           

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
    }
}