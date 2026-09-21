namespace SpendWise.DTOS
{
    public class ResponseBudgetDTO
    {
        public int BudgetId { get; set; }
        public decimal Amount { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
    }
}
