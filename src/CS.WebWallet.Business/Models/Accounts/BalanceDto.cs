namespace CS.WebWallet.Business.Models.Accounts;

public class BalanceDto
{
    public string Amount { get; set; } = "0.00";
    public string Symbol { get; set; }
    public BalanceFiatDto FiatBalance { get; set; } = new();
}