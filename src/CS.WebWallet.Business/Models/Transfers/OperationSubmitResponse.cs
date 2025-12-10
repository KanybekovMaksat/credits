namespace CS.WebWallet.Business.Models.Transfers;

public class OtpDto
{
    public string Otp { get; set; }
    public int ValidFor { get; set; }
    public int ResendAfter { get; set; }
    public bool Validated { get; set; }
}

public class OperationSubmitResponse
{
    public Guid DocumentId { get; set; }
    public string Amount { get; set; }
    public string Fee { get; set; }
    public string ConfirmUrl { get; set; }
    public int Status { get; set; }
    public OtpDto Otp { get; set; }
    public bool RequiresConfirmation { get; set; }
}