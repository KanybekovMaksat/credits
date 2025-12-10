namespace CS.WebWallet.Business.Models.DisplayableMessages;

public class MessagesByTagsDto
{
    public string Tag { get; set; }
    public string Title { get; set; }
    public string Text { get; set; }
    public int? CurrencyId { get; set; }
    public int? BusinessOperationId { get; set; }
}