using CS.WebWallet.Business.Models.Accounts;

namespace CS.WebWallet.Business.Models.Cards;

public class IssuedCardDto
{
    public string Id { get; set; }
    public string Currency { get; set; }
    public string Pan { get; set; }
    public string Holder { get; set; }
    public string ExpiryMonth { get; set; }
    public string ExpiryYear { get; set; }
    public int Type { get; set; }
    public int Status { get; set; }
    public bool UsesFrames { get; set; }
    public Guid InternalAccountId { get; set; }
    public BalanceDto Balance { get; set; } = new();
}