using System.ComponentModel.DataAnnotations;

namespace bank.Models
{
    public class Users
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string First_name { get; set; }
        public string Last_name { get; set; }
        public string CNP { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public string Type { get; set; }

        public virtual ICollection<Accounts> Accounts { get; } = new List<Accounts>();

    }
}
