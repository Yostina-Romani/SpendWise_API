using Microsoft.AspNetCore.Identity;

namespace SpendWise.Models
{
    public class Applicationuser:IdentityUser
    {
        public string name { get; set; }

        public ICollection<Expenses>? expenses { get; set; } =new List<Expenses>();
    }
}
