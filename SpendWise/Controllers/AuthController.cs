using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using SpendWise.DTOS;
using SpendWise.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SpendWise.Services.Interfaces;

namespace SpendWise.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<Applicationuser> _usermanager;
        private readonly IConfiguration _iconfiguration;
        private readonly IEmailservice _emailservice;
        private readonly SignInManager<Applicationuser> _signmanager;
        private readonly ITokenService _tokenservise;

        public AuthController(ITokenService tokenService,SignInManager<Applicationuser> signInManager,UserManager<Applicationuser> userManager, IConfiguration iconfiguration, IEmailservice emailservice)
        {
            _usermanager = userManager;
            _iconfiguration = iconfiguration;
            _emailservice = emailservice;
            _signmanager = signInManager;
            _tokenservise = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO model)
        {
            var user = new Applicationuser
            {
                name = model.yourname,
                Email = model.Email,
                UserName = model.Email,

            };
            var result = await _usermanager.CreateAsync(user, model.password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var roleResult = await _usermanager.AddToRoleAsync(user, "User");

            if (!roleResult.Succeeded)
            {
                return BadRequest(roleResult.Errors);
            }
            return Ok(new { message = "User registered successfully" });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO model)
        {
            var user = await _usermanager.FindByEmailAsync(model.email);
            if (user == null) {
                return Unauthorized("invalid email or password");
            }

            var result = await _usermanager.CheckPasswordAsync(user, model.password);
            if (!result)
            {
                return Unauthorized("invalid email or password");
            }
           

            var jwttoken =await _tokenservise.GenerateTokenAsync( user);

            return Ok(new
            { token = jwttoken
            });
        }
        [HttpPost("forgetPassword")]
        public async Task<IActionResult> forgetPassword(forgetpasswordDTO model)
        {
            var user = await _usermanager.FindByEmailAsync(model.email);
            if (user == null)
            {
                return BadRequest(new
                {
                    message = "If an account exists for this email, a password reset link has been sent."
                });
            }
            var token = await _usermanager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = Uri.EscapeDataString(token);
            var encodedEmail = Uri.EscapeDataString(model.email);

            var resetLink = $"http://127.0.0.1:5500/HTML/ResetPassword.html?email={encodedEmail}&token={encodedToken}";
            var emailDody = $@"

        <h2>Reset Your SpendWise Password</h2>

        <p>You requested to reset your password.</p>

        <p>Click the button below to create a new password:</p>
        <a href='{resetLink}'
           style='
           display:inline-block;
           padding:12px 20px;
           background:#6366f1;
           color:white;
           text-decoration:none;
           border-radius:8px;'>
           
           Reset Password
        </a>

        <p>If you did not request this, you can ignore this email.</p>
             ";
            await _emailservice.SendEmailAsync(user.Email!, "SpendWise - Reset Password", emailDody);

            return Ok(new
            {
                message = "If an account exists for this email, a reset link has been sent."
            });

        }

        [HttpPost("resetPassword")]
        public async Task<IActionResult> resetPassword(resetPasswordDTO model)
        {
            var user = await _usermanager.FindByEmailAsync(model.email);
            if (user == null)
            {
                return BadRequest(new { message = "Unable to reset password." });
            }
            var result = await _usermanager.ResetPasswordAsync(user, model.token, model.password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    Console.WriteLine(
                        $"RESET ERROR: {error.Code} - {error.Description}"
                    );
                }

                return BadRequest(new
                {
                    message = result.Errors.Select(e => e.Description)
                });
            }

            return Ok(new { message = "Password reset successfully." });
        }


        [HttpGet("google-success")]
        public async Task<IActionResult> googleSuccess(){

            var info = await _signmanager.GetExternalLoginInfoAsync();

            if(info == null)
            {
                return Unauthorized("Google authentication failed.");
            }

            var email = info.Principal.FindFirstValue(ClaimTypes.Email);
            var nameg = info.Principal.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Google account does not contain an email.");

            }

            var user = await _usermanager.FindByLoginAsync(info.LoginProvider,info.ProviderKey);
            if (user == null)
            {
                 user = await _usermanager.FindByEmailAsync(email);
                if (user == null)
                {
                    user = new Applicationuser()
                    {
                        name = nameg,
                        Email = email,
                        UserName = email
                    };

                    var createResult=await _usermanager.CreateAsync(user);
                    if (!createResult.Succeeded)
                    {
                        return BadRequest(createResult.Errors);
                    }


                    var roleResult = await _usermanager.AddToRoleAsync(user, "User");

                    if (!roleResult.Succeeded)
                    {
                        return BadRequest(roleResult.Errors);
                    }


                }
                var addLogininfo = await _usermanager.AddLoginAsync(user, info);
                if (!addLogininfo.Succeeded)
                {
                    return BadRequest(addLogininfo.Errors);
                }
            }
            var jwttoken = await _tokenservise.GenerateTokenAsync(user);

            return Ok(new
            {
                token = jwttoken
            });


        }
        [HttpGet("google-login")]
        public async Task<IActionResult> google_login()
        {
            var properties = _signmanager.ConfigureExternalAuthenticationProperties("Google", "/api/Auth/google-success");
            return Challenge(properties, "Google");
        }
    }
}
