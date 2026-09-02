using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SpendWise.DTOS;
using SpendWise.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SpendWise.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<Applicationuser> _usermanager;
        private readonly IConfiguration _iconfiguration;

        public AuthController(UserManager<Applicationuser> userManager,IConfiguration iconfiguration)
        {
            _usermanager=userManager;
            _iconfiguration = iconfiguration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO model)
        {
            var user = new Applicationuser
            {
                name = model.yourname,
                Email=model.Email,
                UserName=model.Email,

            };
            var result = await _usermanager.CreateAsync(user, model.password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            return Ok(new {message= "User registered successfully" });
        }
       

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO model)
        {
            var user=await _usermanager.FindByEmailAsync(model.email);
            if (user == null) {
                return Unauthorized("invalid email or password");
            }

            var result = await _usermanager.CheckPasswordAsync(user,model.password);
            if (!result)
                {
                    return Unauthorized("invalid email or password");
                }
            var roles = await _usermanager.GetRolesAsync(user);


            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier,user.Id),
                new Claim(ClaimTypes.Email,user.Email!)

            };
            foreach(var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role,role));
            }


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_iconfiguration["jwt:key"]!));

            var credentails = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _iconfiguration["jwt:issuer"],
                audience: _iconfiguration["jwt:audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: credentails

                );

            var jwtobject = new JwtSecurityTokenHandler();
            var jwttoken = jwtobject.WriteToken(token);

            return Ok(new
            { token = jwttoken
            });
        }
    }
}
