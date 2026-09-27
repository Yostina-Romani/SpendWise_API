using SpendWise.DTOS;

namespace SpendWise.Services.Interfaces
{
    public interface Iincomeservice
    {
         Task<ResponseIncomeDTO> Addincome(string userid, AddincomeDTO model);
    }
}
