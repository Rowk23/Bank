using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bank.Models
{
    public class Cards
    {
        [Key]
        public int id { get; set; }
        public string number { get; set; }
        public string holderName { get; set; }
        public DateOnly expirationDate { get; set; }
        public int CVV { get; set; }
        public int AccountsId { get; set; }
        public Accounts Accounts { get; set; }

    }
}
