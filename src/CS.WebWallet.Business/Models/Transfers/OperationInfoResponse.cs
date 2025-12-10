using CS.WebWallet.Business.Models.Hubs;
using CS.WebWallet.Business.Models.Transfers.Crypto;

namespace CS.WebWallet.Business.Models.Transfers;

public class OperationInfoResponse
{
    public Guid DocumentId { get; set; }
    public bool Allowed { get; set; }
    public CurrencySizeDto AmountFrom { get; set; }
    public CurrencySizeDto AmountTo { get; set; }
    public CurrencySizeDto Fee { get; set; }
    public RateDto Rate { get; set; }
    public int BusinessOperationId { get; set; }
}