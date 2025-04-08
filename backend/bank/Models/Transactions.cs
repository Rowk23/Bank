using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bank.Models
{
    public class Transactions
    {
        [Key]
        public int id { get; set; }

        public string identifier { get; set; }

        public int AccountsFROM { get; set; }
        public int AccountsTO { get; set; }
        public double amount { get; set; }
        public string currency { get; set; }
        public DateTime time { get; set; }
        public string type { get; set; }
        [Phone]
        public string phone { get; set; }
        public Accounts Accounts { get; set; }
    }
}
