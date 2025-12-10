namespace CS.WebWallet.Business.Models.History;

public class HistoryDto
{
    public string Id { get; set; }
    public bool Income { get; set; }
    public DateTime Time { get; set; }
    
    // header
    public string Received { get; set; }
    public string ReceivedTicker { get; set; }
    public string ReceivedCurrencyName { get; set; }

    // exchange only
    public string Paid { get; set; }
    public string PaidTicker { get; set; }
    public string PaidCurrencyName { get; set; }
    public string Rate { get; set; }
    
    public string Fee { get; set; }
    public string FeeTicker { get; set; }
    public string FeeCurrencyName { get; set; }

    public string Recipient { get; set; } // internal transfer only -> other customer name
    public string RecipientAddress { get; set; } // wallet, card, iban
    public string RecipientAvatarUrl { get; set; }
    
    public WalletOperationType Type { get; set; }
    public int Status { get; set; }
}