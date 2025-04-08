using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bank.Models
{
    public class Accounts
    {
        [Key]
        public int id { get; set; }
        public string IBAN { get; set; }
        [ForeignKey("User")]
        public int ownerId { get; set; }
        public string currency { get; set; }
        public double balance { get; set; }
        public int UsersId { get; set; }
        public virtual ICollection<Cards> Cards { get; } = new List<Cards>();
        public virtual ICollection<Transactions> Transactions { get; } = new List<Transactions>();
        public Users Users { get; set; }
    }
}
