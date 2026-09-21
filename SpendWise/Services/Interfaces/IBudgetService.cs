using Microsoft.AspNetCore.SignalR;
using SpendWise.DTOS;
namespace SpendWise.Services.Interfaces
{
    public interface IBudgetService
    {

        Task<ResponseBudgetDTO?> updateBudget(string userid,int budgetID,UpdateBudgetDTO model);
        Task<bool>Deletebudget(string userid,int budgetID);
        Task<ResponseBudgetDTO?> createbudget(string userid, BudgetDTO model);
        Task<ResponseBudgetDTO?> Getbudget(string userid, int month, int year);

    }
}
