using System.ComponentModel.DataAnnotations.Schema;

namespace bank.DTO
{
    public class AccountDTO
    {
        public string IBAN { get; set; }
        public int UsersId { get; set; }
        public string currency { get; set; }
        public double balance { get; set; }
    }
}
