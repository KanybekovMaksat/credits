namespace CS.WebWallet.Business.Models.Exchange;

public class RateRequestDto
{
    public Guid AddressTo { get; set; }
    public Guid AddressFrom { get; set; }
    public decimal AmountFrom { get; set; }
    public decimal AmountTo { get; set; }
    public Guid DocumentId { get; set; }
}