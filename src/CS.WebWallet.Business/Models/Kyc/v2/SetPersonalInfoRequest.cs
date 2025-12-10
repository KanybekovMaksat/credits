using System.ComponentModel.DataAnnotations;

namespace CS.WebWallet.Business.Models.Kyc.v2;

public class SetPersonalInfoRequest
{
    [Required] public int StageId { get; set; }
    [Required] public string FirstName { get; set; }
    [Required] public string LastName { get; set; }
    [Required] public string CountryId { get; set; }
    [Required] public string City { get; set; }
    [Required] public string PostalCode { get; set; }
    public string Street { get; set; }
    public string State { get; set; }
    public string Building { get; set; }
    public string Flat { get; set; }
    public string Nationality { get; set; }
    public string PlaceOfBirth { get; set; }
    public DateTime DateOfBirth { get; set; }
}