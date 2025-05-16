using System.ComponentModel.DataAnnotations;

namespace bank.DTO
{
    public class TransactionDTO
    {
        public string identifier { get; set; }
        public double amount { get; set; }
        public string currency { get; set; }
        public DateTime time { get; set; }
        public string type { get; set; }
        public int FROMid { get; set; }
        public int TOid { get; set; }
        public string phone { get; set; }
    }
}
