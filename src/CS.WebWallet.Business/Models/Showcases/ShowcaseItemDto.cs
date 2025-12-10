namespace CS.WebWallet.Business.Models.Showcases;

public class ShowcaseItemDto
{
    public int Id { get; set; }
    public int Order { get; set; }
    public string Icon { get; set; }
    public bool NeedToAcceptEULA { get; set; }
    public string EULA { get; init; }
    public string EULALink { get; init; }
    public bool CanBeRequested { get; set; }
    public string Message { get; set; }
    public string Title { get; set; }
    public string Text { get; set; }
}