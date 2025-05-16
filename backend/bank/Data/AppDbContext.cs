using bank.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using System.Text.RegularExpressions;

namespace bank.Data
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions options): base(options) 
        {
            try
            {
                var databaseCreator = Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator;
                if (databaseCreator != null)
                {
                    if (!databaseCreator.CanConnect()) databaseCreator.Create();
                    if (!databaseCreator.HasTables()) databaseCreator.CreateTables();

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
        public DbSet<Users> Users { get; set; }
        public DbSet<Accounts> Accounts { get; set; }
        public DbSet<Cards> Cards { get; set; }
        public DbSet<Transactions> Transactions { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Transactions>()
                        .HasOne(t => t.TReceiver)
                        .WithMany(a => a.ReceiverTransactions)
                        .HasForeignKey(t => t.TOid)
                        .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Transactions>()
                        .HasOne(t => t.TSender)
                        .WithMany(a => a.SenderTransactions)
                        .HasForeignKey(t => t.FROMid)
                        .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Accounts>()
                        .HasOne(a => a.Users)
                        .WithMany(u => u.Accounts)
                        .HasForeignKey(a => a.UsersId);

        }
    }
}
