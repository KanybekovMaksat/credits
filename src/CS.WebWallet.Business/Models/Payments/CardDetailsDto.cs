namespace CS.WebWallet.Business.Models.Payments;

public class CardDetailsDto
{
    public string Number { get; set; }
    public string HolderName { get; set; }
    public int ExpireMonth { get; set; }
    public int ExpireYear { get; set; }
    public string SecurityCode { get; set; }
}