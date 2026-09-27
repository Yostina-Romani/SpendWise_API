using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpendWise.DTOS;
using SpendWise.Services.Interfaces;
using System.Security.Claims;

namespace SpendWise.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IncomeController : ControllerBase
    {
        private readonly Iincomeservice _iincomeservice;
        public IncomeController(Iincomeservice iincomeservice) {
         _iincomeservice= iincomeservice;
        
        }

        [HttpPost]
        public async Task<IActionResult> addincome(AddincomeDTO model)
        {
            var userid = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userid == null)
            {
                return NotFound(new
                {
                    message = "not found"
                });
            }

            var result = await _iincomeservice.Addincome(userid, model);

            return Ok(result);

        }

        
    }
}
