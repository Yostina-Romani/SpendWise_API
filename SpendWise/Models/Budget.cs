using Microsoft.EntityFrameworkCore;
using SpendWise.Models;
using System.ComponentModel.DataAnnotations;

public class Budget
{
    [Key]
    public int BudgetId { get; set; }

    [Required]
    [Precision(18, 2)]
    public decimal Amount { get; set; }

    [Required]
    public int Month { get; set; }

    [Required]
    public int Year { get; set; }

    [Required]
    public string? UserId { get; set; }

    public Applicationuser? User { get; set; }
}