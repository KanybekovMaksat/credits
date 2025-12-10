namespace CS.WebWallet.Business.Models.Commons;

public class RequestMetadataDto
{
    public string IpAddress { get; set; }
    public string Device { get; set; }
    public string Currency { get; set; }
    public string DeviceToken { get; set; }
    public string UserAgent { get; set; }
}