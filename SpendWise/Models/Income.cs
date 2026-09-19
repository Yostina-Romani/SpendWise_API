using Microsoft.EntityFrameworkCore;
using SpendWise.Models;
using System.ComponentModel.DataAnnotations;

public class Income
{
    [Key]
    public int IncomeId { get; set; }

    [Required]
    [Precision(18, 2)]
    public decimal Amount { get; set; }

    [Required]
    public DateTime IncomeTime { get; set; }

    [Required]
    public string UserId { get; set; }

    public Applicationuser User { get; set; }
}