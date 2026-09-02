using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
namespace SpendWise.DTOS
{
    public class addExpenseDTO
    {
        [Required]
        [Precision(18, 2)]
        public decimal expenseAmount { get; set; }
        [Required]
        public DateTime expenseTime { get; set; }
        public int categoryID { get; set; }

    }
}
