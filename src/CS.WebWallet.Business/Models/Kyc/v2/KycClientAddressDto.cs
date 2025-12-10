namespace CS.WebWallet.Business.Models.Kyc.v2;

public class KycClientAddressDto
{
    public string CountryId { get; set; }
    public string Region { get; set; }
    public string State { get; set; }
    public string City { get; set; }
    public string Street { get; set; }
    public string Building { get; set; }
    public string BuildingNumber { get; set; }
    public string Flat { get; set; }
    public string PostalCode { get; set; }
}