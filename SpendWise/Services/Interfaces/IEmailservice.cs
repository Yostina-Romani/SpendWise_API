namespace SpendWise.Services.Interfaces
{
    public interface IEmailservice
    {
        Task SendEmailAsync(string to, string subject, string body);
    }
}
