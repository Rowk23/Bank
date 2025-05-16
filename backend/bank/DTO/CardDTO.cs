namespace bank.DTO
{
    public class CardDTO
    {
        public string number { get; set; }
        public string holderName { get; set; }
        public DateOnly expirationDate { get; set; }
        public int CVV { get; set; }
        public int AccountsId { get; set; }
    }
}
