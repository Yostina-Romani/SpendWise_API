using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
namespace SpendWise.DTOS
{
    public class forgetpasswordDTO
    {
        [Required]
        [EmailAddress]
        public string email { get; set; }
    }
}
