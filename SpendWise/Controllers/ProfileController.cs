using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SpendWise.Services;
using SpendWise.Services.Interfaces;
using System.Security.Claims;
namespace SpendWise.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpGet("getprofile")]
        [Authorize]
        public async Task<IActionResult> getprofile()
        {
            var userid = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userid == null)
            {
                return Unauthorized();
            }
            var profile =await _profileService.getProfile(userid);
            if (profile == null)
            {
                return NotFound(new
                {
                    message = "not found"
                });
            }

            return Ok(profile);
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> uploadimage(IFormFile image)
        {
            var userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userid == null)
            {
                return Unauthorized();
            }
            if (image == null||image.Length==0)
            {
                return BadRequest(new
                {
                    message="please select an image."
                });


            }

            var imageurl = await _profileService.uploadImage(userid, image);

            return Ok(new
            {
                message = "upload successfully",
                imageurl
            });
        }
    }
}
