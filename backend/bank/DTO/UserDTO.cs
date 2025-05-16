using System.ComponentModel.DataAnnotations;

namespace bank.DTO
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string First_name { get; set; }
        public string Last_name { get; set; }
        public string CNP { get; set; }
        public string Email { get; set; }
        public string Type { get; set; }
    }
}
