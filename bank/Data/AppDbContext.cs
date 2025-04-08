using bank.Models;
using Microsoft.EntityFrameworkCore;

namespace bank.Data
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions options): base(options) 
        { 
        }
        public DbSet<Users> Users { get; set; }
        public DbSet<Accounts> Accounts { get; set; }
        public DbSet<Cards> Cards { get; set; }
        public DbSet<Transactions> Transactions { get; set; }
    }
}
