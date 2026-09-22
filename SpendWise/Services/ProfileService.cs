using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SpendWise.DTOS;
using SpendWise.Models;
using SpendWise.Services.Interfaces;
using System.Reflection;

namespace SpendWise.Services
{
    public class ProfileService:IProfileService
    {
        private readonly UserManager<Applicationuser> _userManager;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ProfileService(UserManager<Applicationuser>userManager,IWebHostEnvironment webHostEnvironment)
        {
            _userManager = userManager;
            _webHostEnvironment = webHostEnvironment;
        }
        public async Task<ProfileDTO?> getProfile(string userid)
        {
            var user = await _userManager.FindByIdAsync(userid);
            if (user == null)
            {
                return null;
            }

            return new ProfileDTO
            { Id=user.Id,
                Name = user.name,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                imageurl=user.ProfileImageUrl
                
            };
        }

        public async Task<string?> uploadImage(string userid,IFormFile image)
        {
            var user =await _userManager.FindByIdAsync(userid);
            if (user == null)
            {
                return null;
            }

            var folderPath = Path.Combine(_webHostEnvironment.WebRootPath, "Images", "profile");

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var extension = Path.GetExtension(image.FileName);
            var filename = $"{Guid.NewGuid()}{extension}";

            var filepath = Path.Combine(folderPath, filename);

            using (var stream=new FileStream(filepath,FileMode.Create)) {

                await image.CopyToAsync(stream);
            }
            var imageurl = $"/Images/profile/{filename}";
            user.ProfileImageUrl = imageurl;

            await _userManager.UpdateAsync(user);

            return imageurl;
        }
    }
}
