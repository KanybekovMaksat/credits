namespace CS.WebWallet.Business.Models.Transfers;

public class OperationInfoRequest
{
    public Guid AccountFromId { get; set; }
    public Guid AccountToId { get; set; }
    public decimal AmountFrom { get; set; }
    public decimal AmountTo { get; set; }
    public OperationRespondent Respondent { get; set; }
}

public class OperationRespondent
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string CountryId { get; set; }
    public string ExternalId { get; set; }
    public string CardId { get; set; }
    public string BeneficiaryIban { get; set; }
    public string BeneficiarySwift { get; set; }
    public string Purpose { get; set; }
    public bool SwiftPreferred { get; set; }
}