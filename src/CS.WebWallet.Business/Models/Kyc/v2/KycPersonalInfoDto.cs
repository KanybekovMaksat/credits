namespace CS.WebWallet.Business.Models.Kyc.v2;

public class KycPersonalInfoDto
{
    public string Phone { get; set; }
    public string Mail { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Nationality { get; set; }
    public string PlaceOfBirth { get; set; }
    public string AvatarUrl { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public int? Gender { get; set; }
    public KycClientAddressDto Address { get; set; }
}