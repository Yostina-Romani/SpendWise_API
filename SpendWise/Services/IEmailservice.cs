

namespace SpendWise.Services
{
    public interface IEmailservice
    {
        Task SendEmailAsync(string to, string subject, string body);
    }
}
