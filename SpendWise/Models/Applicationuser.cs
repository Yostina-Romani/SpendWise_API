using Microsoft.AspNetCore.Identity;

namespace SpendWise.Models
{
    public class Applicationuser:IdentityUser
    {
        public string name { get; set; }
        public string? ProfileImageUrl { get; set; }
        public ICollection<Expenses>? expenses { get; set; } =new List<Expenses>();
        public ICollection<Income>? incomes { get; set; } = new List<Income>();
        public ICollection<Budget>? budgets { get; set; } = new List<Budget>();
    }
}
