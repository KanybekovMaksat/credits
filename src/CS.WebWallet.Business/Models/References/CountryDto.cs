namespace CS.WebWallet.Business.Models.References;

public class CountryDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string NativeName { get; set; }
    public List<string> PhoneCodes { get; set; } = new();
    public bool IsBlocked { get; set; }
}