using System.ComponentModel.DataAnnotations;

namespace SpendWise.DTOS
{
    public class UpdateBudgetDTO
    {
        [Required]
        [Range(0.01, 999999999)]
        public decimal Amount { get; set; }
    }
}
