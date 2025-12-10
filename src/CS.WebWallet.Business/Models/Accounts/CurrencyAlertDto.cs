namespace CS.WebWallet.Business.Models.Accounts;

public class CurrencyAlertDto
{
    public int Level { get; set; }
    public int CurrencyId { get; set; }
    public string CurrencyCode { get; set; }
    public string Message { get; set; }
}