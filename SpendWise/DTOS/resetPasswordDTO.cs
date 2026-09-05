using Microsoft.AspNetCore.Mvc;
namespace SpendWise.DTOS
{
    public class resetPasswordDTO
    {
       public string email { get; set; }
        public string token { get; set; }
        public string password { get; set; }
    }
}
