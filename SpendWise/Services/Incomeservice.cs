
using SpendWise.Services.Interfaces;
using SpendWise.DTOS;
using Microsoft.AspNetCore.Http.HttpResults;
using SpendWise.Repositories;
namespace SpendWise.Services
{
    public class Incomeservice:Iincomeservice
    {
        private readonly IincomeRepository _iincomeRepository;
        public Incomeservice(IincomeRepository iincomeRepository)
        {
            _iincomeRepository = iincomeRepository;
        }
        public async Task<ResponseIncomeDTO> Addincome(string userid,AddincomeDTO model)
        {

            if (model.Amount <= 0)
            {
                throw new ArgumentException("Income amount must be greater than zero.");
            }

            var income = new Income
            {
                Amount = model.Amount,
                UserId = userid,
                IncomeTime = model.IncomeTime,

            };

          await  _iincomeRepository.Addincome(income);

            return new ResponseIncomeDTO
            {
                dateTime = income.IncomeTime,
                amount = income.Amount,
                incomeId = income.IncomeId,

            };



        }

    }
}
