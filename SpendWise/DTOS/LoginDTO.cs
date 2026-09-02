using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace SpendWise.DTOS
{
    public class LoginDTO
    {
        [Required]
        public string password { get; set; }
        [Required]
        public string email { get; set; }
    }
}
