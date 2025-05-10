using System.ComponentModel.DataAnnotations;

namespace bank.Models
{
    public class RegisterDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string First_name { get; set; }
        public string Last_name { get; set; }
        public string CNP { get; set; }
        public string Email { get; set; }
    }
}
