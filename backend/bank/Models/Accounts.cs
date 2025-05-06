using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bank.Models
{
    public class Accounts
    {
        [Key]
        public int id { get; set; }
        public string IBAN { get; set; }
        [ForeignKey("Users")]
        public int ownerId { get; set; }
        public string currency { get; set; }
        public double balance { get; set; }
        public int UsersId { get; set; }
        public ICollection<Cards> Cards { get; } = new List<Cards>();
        public ICollection<Transactions> SenderTransactions { get; set; } = new List<Transactions>();
        public ICollection<Transactions> ReceiverTransactions { get; set; } = new List<Transactions>();
        public Users Users { get; set; }
    }
}
