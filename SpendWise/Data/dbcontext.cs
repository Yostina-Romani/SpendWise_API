using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using SpendWise.Models;
using Microsoft.AspNetCore.Identity;


namespace SpendWise.Data
{
    public class dbcontext : IdentityDbContext<Applicationuser>
    {
        public dbcontext(DbContextOptions<dbcontext>options)
        :base(options)
        { }
        public DbSet<Expenses>expense{ get; set; }
        public DbSet<Categories> category { get; set; }
    }
}
