
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
namespace SpendWise.DTOS
{
    public class AddincomeDTO
    {
        [Required]

        [Precision(18, 2)]
        public decimal Amount { get; set; }

        [Required]
        public DateTime IncomeTime { get; set; } = DateTime.Now;

    }
}
