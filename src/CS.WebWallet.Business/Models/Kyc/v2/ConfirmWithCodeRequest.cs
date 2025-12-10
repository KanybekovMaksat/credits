namespace CS.WebWallet.Business.Models.Kyc.v2;

public class ConfirmWithCodeRequest
{
    public int StageId { get; set; }
    public string Code { get; set; }
}