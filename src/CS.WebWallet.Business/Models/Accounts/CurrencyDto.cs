namespace CS.WebWallet.Business.Models.Accounts;

public class CurrencyDto
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public string Symbol { get; set; }
    public string IconUrl { get; set; }
    public bool IsCryptoCurrency { get; set; }
    public bool IsToken { get; set; }
    public List<CurrencyAlertDto> Alerts { get; set; }

    public void SetFullIconUrl(string protocol, string host)
    {
        IconUrl = string.IsNullOrEmpty(IconUrl) ? string.Empty : $"{protocol}://{host}/{IconUrl.Trim('/')}";
    }
}