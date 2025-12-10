namespace CS.WebWallet.Business.Models.DisplayableMessages;

public class MessagesByTagsTagFilter
{
    public string Tag { get; set; }
    public int? CurrencyId { get; set; }
    public int? BusinessOperationId { get; set; }
}