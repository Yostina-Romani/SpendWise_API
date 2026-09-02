using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using SpendWise.Models;
namespace SpendWise.Data
{
    public class IdentitySeeder
    {
        public static async Task RoleIsentityAsync(RoleManager<IdentityRole> roleManager,UserManager<Applicationuser>userManager)
        {
            string[]roles= { "Admin","User" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                   await roleManager.CreateAsync(new IdentityRole(role));
                }

            }

            string adminemail = "admin@spendwise.com";
            string adminPassword = "Rtheysma9*";
            var admin= await userManager.FindByEmailAsync(adminemail);
            if (admin == null)
            {
                var user = new Applicationuser
                {
                    name = "spendWise admin",
                    UserName = adminemail,
                    Email = adminemail
                };

                var result = await userManager.CreateAsync(user, adminPassword);
                if (!result.Succeeded)
                {
                    throw new Exception(
                        string.Join(", ", result.Errors.Select(e => e.Description))
                        );
                }
                admin = user;
            }
                if(! await userManager.IsInRoleAsync(admin,"Admin"))
                {
                 await   userManager.AddToRoleAsync(admin, "Admin");

                }
            


        }
       
       

        
        
    }
}
