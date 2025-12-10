namespace CS.WebWallet.Business.Models.Kyc.v2;

public class SetPhoneRequest
{
    public int StageId { get; set; }
    public string Phone { get; set; }
    public string CountryId { get; set; }
}