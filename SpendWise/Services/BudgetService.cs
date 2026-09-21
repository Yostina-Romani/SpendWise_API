using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SpendWise.Data;
using SpendWise.DTOS;
using SpendWise.Models;
using SpendWise.Services.Interfaces;

namespace SpendWise.Services
{
    public class BudgetService:IBudgetService
    {
        private readonly dbcontext _dbcontext;
        public BudgetService(dbcontext dbcontext)
        {
            
            _dbcontext = dbcontext;
        }

        public async Task<bool> Deletebudget(string userid,int budgetid)
        {
            

            var deleteRows = await _dbcontext.budget.Where(b => b.UserId == userid && b.BudgetId == budgetid).ExecuteDeleteAsync();

            return deleteRows>0;


        }
        //update budget
        public async Task<ResponseBudgetDTO?> updateBudget(string userid, int budgetid, UpdateBudgetDTO model) {

            var budget = await _dbcontext.budget.FirstOrDefaultAsync(b => b.UserId == userid && b.BudgetId == budgetid);
            if (budget == null)
            {
                return null;
            }

            budget.Amount = model.Amount;
            await _dbcontext.SaveChangesAsync();

            return new ResponseBudgetDTO
            {
                BudgetId = budget.BudgetId,
                Amount = budget.Amount,
                Year = budget.Year,
                Month = budget.Month,
            };


        
        }

        //create budget
        public async Task<ResponseBudgetDTO?> createbudget(string userid,BudgetDTO model)
        {
            var budgetexist = await _dbcontext.budget.AnyAsync(b => b.UserId == userid && b.Year == model.Year && b.Month == model.Month);
            if (budgetexist)
            {
                return null;
            }
            var bugetCreate=new Budget
            {
                Amount = model.Amount,
                Year = model.Year,
                Month = model.Month,
                UserId=userid
                

            };
            await _dbcontext.budget.AddAsync(bugetCreate);
            await _dbcontext.SaveChangesAsync();

            return new ResponseBudgetDTO
            {
                Year=bugetCreate.Year,
                Month=bugetCreate.Month,
                BudgetId=bugetCreate.BudgetId,
                Amount=bugetCreate.Amount,
            };


        }

        //get budget 
        public async Task<ResponseBudgetDTO?> Getbudget(string userid,  int month, int year )
        {
            var budget = await _dbcontext.budget.FirstOrDefaultAsync(b => b.Year == year && b.Month == month && b.UserId == userid);
            if (budget == null)
            {
                return null;
            }

            return new ResponseBudgetDTO
            {
                BudgetId = budget.BudgetId,
                Year = budget.Year,
                Month = budget.Month,
                Amount = budget.Amount
            };

        }

    }
}
