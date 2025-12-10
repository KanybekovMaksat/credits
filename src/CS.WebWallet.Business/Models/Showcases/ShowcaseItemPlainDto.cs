using CS.Contracts.Contracts.Commons.Enums;

namespace CS.WebWallet.Business.Models.Showcases;

public class ShowcaseItemPlainDto
{
    public int Id { get; set; }
    public int Order { get; set; }
    public string Icon { get; set; }
    public bool NeedToAcceptEULA { get; set; }
    public string EULA { get; init; }
    public string EULALink { get; set; }
    public bool Requested { get; set; }
    public string Message { get; set; }
    public ShowcaseType ShowcaseType { get; set; }
    public string Title { get; set; }
    public string Text { get; set; }
    public List<ShowcaseItemKycStageDto> RequiredKycStages { get; set; } = new();
}