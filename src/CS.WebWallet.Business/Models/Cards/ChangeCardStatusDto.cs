namespace CS.WebWallet.Business.Models.Cards;

public class ChangeCardStatusDto
{
    public Guid RequestKey { get; set; }
    public int NewStatus { get; set; }
    public string Url { get; set; }
    public bool RequiresConfirmation { get; set; }
}