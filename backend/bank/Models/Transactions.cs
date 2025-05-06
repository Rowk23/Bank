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
        public double amount { get; set; }
        public string currency { get; set; }
        public DateTime time { get; set; }
        public string type { get; set; }
        public int FROMid{ get; set; }
        public int TOid { get; set; }
        [Phone]
        public string phone { get; set; }
        [ForeignKey("FROMid")]
        public Accounts TSender { get; set; }
        [ForeignKey("TOid")]
        public Accounts TReceiver { get; set; }
    }
}
