using SpendWise.Data;

namespace SpendWise.Repositories
{
    public class IncomeRepository:IincomeRepository
    {
        private readonly dbcontext _dbcontext;
        public IncomeRepository(dbcontext dbcontext)
        {
            _dbcontext = dbcontext;

        }
        public async Task Addincome(Income model)
        {
            await _dbcontext.income.AddAsync(model);
            await _dbcontext.SaveChangesAsync();
        }
    }
}
