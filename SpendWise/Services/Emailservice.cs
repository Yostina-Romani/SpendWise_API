using SpendWise.Services.Interfaces;
using System.Net;
using System.Net.Mail;
namespace SpendWise.Services
{
    public class Emailservice:IEmailservice
    {
        private readonly IConfiguration _configuration;
        public Emailservice(IConfiguration configuration)
        {
            _configuration= configuration;

        }
      public  async Task SendEmailAsync(string to,string subject,string body)
        {
            var email = _configuration["EmailSetting:email"];
            var password = _configuration["EmailSetting:Password"];
            var message = new MailMessage
            {
                From = new MailAddress(email!),
                Subject = subject,
                Body = body,
                
                IsBodyHtml=true,
                

            };
            message.To.Add(to);
            using var smtp = new SmtpClient("smtp.gmail.com", 587);
            smtp.EnableSsl = true;
            smtp.Credentials = new NetworkCredential(email, password);

            await smtp.SendMailAsync(message);
            
        }
    }
}
