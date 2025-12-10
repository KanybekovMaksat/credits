namespace CS.WebWallet.Business.Models.Accounts;

public class AccountRefDto
{
    public Guid AccountId { get; set; }
    public int Fraction { get; set; }
    public string Amount { get; set; }
    public string CurrencyAmount { get; set; }
    public string Icon { get; set; }
    public string Ticker { get; set; }
    public string Name { get; set; }
    public int CurrencyId { get; set; }
    public int Type { get; set; }
    public string Title { get; set; }
    public string Text { get; set; }
    public string CurrencyName { get; set; }
    public string CurrencySymbol { get; set; }
    public string ExternalKey { get; set; }
    public bool IsCrypto { get; set; }
    public PossibleOperationsDto Operations { get; set; } = new();
    public List<CurrencyAlertDto> Alerts { get; set; }
}

public class OperationDetails
{
    public OperationRequirement Requirement { get; set; }
    public Guid? From { get; set; }
    public Guid? To { get; set; }
    public decimal Rate { get; set; } = 1;
}

public class PossibleOperationsDto
{
    public List<OperationDetails> TopUp { get; set; } = new();
    public List<OperationDetails> Transfer { get; set; } = new();
    public List<OperationDetails> Exchange { get; set; } = new();
}