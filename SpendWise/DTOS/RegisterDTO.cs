using System.ComponentModel.DataAnnotations;

namespace SpendWise.DTOS
{
    public class RegisterDTO
    {

        [Required,MinLength(3),MaxLength(50)]
        public string yourname { get; set; }


        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required,MinLength(7)]
        public string password { get; set; }
        [Required ,Compare("password")]

        public string passwordConfirmation { get; set; }
    }
}
