namespace CS.WebWallet.Business.Models.Kyc;

public class ChangePhoneMailModel
{
    public ChangeStep Step { get; set; }
    public string NewValue { get; set; }
    public string Code { get; set; }
    public string CountryId { get; set; }
}