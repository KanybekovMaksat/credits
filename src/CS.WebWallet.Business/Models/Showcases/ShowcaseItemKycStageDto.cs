using CS.Contracts.Contracts.Commons.Enums.Kyc;

namespace CS.WebWallet.Business.Models.Showcases;

public class ShowcaseItemKycStageDto
{
    public int Id { get; set; }
    public int ProviderId { get; set; }
    public KycStage Stage { get; set; }
    public string KycUrl { get; set; }
    public string KycToken { get; set; }
}