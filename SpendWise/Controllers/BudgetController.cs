using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using SpendWise.Models;
using SpendWise.Services;
using SpendWise.Services.Interfaces;
using System.Security.Claims;
using SpendWise.Models;
using SpendWise.Data;
using Microsoft.AspNetCore.Authorization;
using SpendWise.DTOS;


namespace SpendWise.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    [Authorize]
    public class BudgetController : ControllerBase
    {
      private readonly IBudgetService _budgetsevice;

       
      
        public BudgetController(IBudgetService budgetService)
        {
            _budgetsevice = budgetService;
           

        }


        //delete budget
        [HttpDelete("{budgetid}")]
        public async Task<IActionResult> deletebudget(int budgetid)
        {
            var userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userid == null)
            {
                return Unauthorized(new
                {
                    message = "User is not authenticated."
                });
            }

          

            var result = await _budgetsevice.Deletebudget(userid,budgetid);
            if (!result)
            {
                return NotFound(new
                {
                    message = "Budget not found."
                });
            }

            return Ok(new
            {
                message = "Budget deleted successfully."
            });
        }

        //create budget 
        [HttpPost]
        public async Task<IActionResult> createBudget(BudgetDTO model)
        {
            var userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userid == null)
            {
                return Unauthorized(new
                {
                    message = "not authorized"
                });
            }


            var result = await _budgetsevice.createbudget(userid!, model);

            if (result == null)
            {
                return Conflict(new
                {
                    message= "A budget already exists for this month."
                });
            }
            return Ok(result);


        }

        //get budget
        [HttpGet]
        public async Task<IActionResult> getBudget(int month,int year )
        {
            var userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userid == null)
            {
                return Unauthorized(new
                {
                    message = "unauthorized"
                });
            }

                var result = await _budgetsevice.Getbudget(userid, month, year);
                if (result == null)
                {
                    return NotFound(new
                    {
                        message = "not found"
                    });
                }
                return Ok(result);
            
        }

        //update budget
        [HttpPut("{budgetid}")]
        public async Task<IActionResult> updateBudget(int budgetid,UpdateBudgetDTO model)
        {
            var userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userid == null)
            {
                return Unauthorized(new
                {
                    message = "not authorized"
                });

            }
            var result = await _budgetsevice.updateBudget(userid, budgetid, model);
            if (result == null)
            {
                return NotFound(new
                {
                    message = "not found"
                });

            }
            return Ok(result);
        }
        
    }
}
