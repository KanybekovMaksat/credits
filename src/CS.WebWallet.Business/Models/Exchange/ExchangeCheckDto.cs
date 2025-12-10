namespace CS.WebWallet.Business.Models.Exchange;

public class ExchangeCheckDto
{
    public bool Allowed { get; set; }
    public decimal AmountFrom { get; set; }
    public decimal AmountTo { get; set; }
    public decimal Fee { get; set; }
    public decimal Rate { get; set; }
    public string Pair { get; set; }
    public Guid DocumentId { get; set; }
    public int BusinessOperationId { get; set; }
}