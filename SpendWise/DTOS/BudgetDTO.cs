using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc;

namespace SpendWise.DTOS
{
    public class BudgetDTO
    {

        [Required]
        [Range(0.01, 999999999)]
        public decimal Amount { get; set; }

        [Range(1, 12)]
        public int Month { get; set; }

        [Range(2000, 2100)]
        public int Year { get; set; }
    }
}
