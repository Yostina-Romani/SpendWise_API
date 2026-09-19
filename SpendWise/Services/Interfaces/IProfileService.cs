using SpendWise.DTOS;

namespace SpendWise.Services.Interfaces
{
    public interface IProfileService
    {
        Task<ProfileDTO?> getProfile(string userid);
        Task<string?> uploadImage(string id, IFormFile image);
    }
}
