namespace CS.WebWallet.Business.Models.Kyc.v2;

public class KycStatusDto
{
    public string Note { get; set; }
    public List<KycStageStatusDto> Stages { get; set; }
}

public class KycStageStatusDto
{
    public int Id { get; set; }
    public int ProviderId { get; set; }
    public int Stage { get; set; }
    public int Status { get; set; }
    public string KycToken { get; set; }
    public string Note { get; set; }
    public bool Required { get; set; }
}