using SpendWise.Models;

namespace SpendWise.Services.Interfaces
{
    public interface ITokenService
    {
        Task<string> GenerateTokenAsync(Applicationuser user);
    }
}