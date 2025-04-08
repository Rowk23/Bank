using System.ComponentModel.DataAnnotations;

namespace bank.Models
{
    public class Users
    {
        [Key]
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string First_name { get; set; }
        public required string Last_name { get; set; }
        public required string CNP { get; set; }
        [EmailAddress]
        public required string Email { get; set; }
        public required string Type { get; set; }

        public virtual ICollection<Accounts> Accounts { get; } = new List<Accounts>();

    }
}
