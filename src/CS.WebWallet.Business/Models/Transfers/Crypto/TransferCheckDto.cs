namespace CS.WebWallet.Business.Models.Transfers.Crypto;

public class TransferCheckDto
{
    public Guid DocumentId { get; set; }
    public bool IsExternal { get; set; }
    public CurrencySizeDto Amount { get; set; }
    public CurrencySizeDto Fee { get; set; }
    public int BusinessOperationId { get; set; }
}