namespace CS.WebWallet.Business.Models.Cards;

public class IssuedCardRequisitesDto
{
    public string Id { get; set; }
    public string Pan { get; set; }
    public string Holder { get; set; }
    public string ExpiryMonth { get; set; }
    public string ExpiryYear { get; set; }
    public string Pin { get; set; }
    public string Url { get; set; }
}