using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace SpendWise.Models
{
    public class Expenses
    {
        [Key]
        public int expenseId { get; set; }
        [Required]
        [Precision(18,2)]
        public decimal expenseAmount { get; set; }
        [Required]
        public DateTime expenseTime { get; set; }
        
        public string UserId { get; set; }
        public Applicationuser user { get; set; }
        
        public int categoryID { get; set; }
        public virtual Categories ?Category { get; set; }

    }
}
