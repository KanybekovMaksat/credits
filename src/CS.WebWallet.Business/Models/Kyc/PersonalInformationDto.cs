namespace CS.WebWallet.Business.Models.Kyc;

public class PersonalInformationDto
{
    public bool IsPhoneVerified { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Address1 { get; set; }
    public string Address2 { get; set; }
    public string ZipCode { get; set; }
    public string Country { get; set; }
    public string CountryId { get; set; }
    public string City { get; set; }
    public string Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
}