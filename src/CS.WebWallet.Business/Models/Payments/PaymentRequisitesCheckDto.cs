namespace CS.WebWallet.Business.Models.Payments;

public class PaymentRequisitesCheckDto
{
    public string Recipient { get; set; }
    public string IBAN { get; set; }
    public string BIC { get; set; }
    public string BankName { get; set; }
    public string BankAddress { get; set; }
    public string PaymentPurpose { get; set; }
    public string Info { get; set; }
}