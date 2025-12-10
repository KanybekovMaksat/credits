using System.ComponentModel.DataAnnotations;

namespace CS.WebWallet.Business.Models.Transfers;

public class SubmitRequest
{
    [Required] public bool Confirmed { get; set; }
    [Required] public Guid DocumentId { get; set; }
    public string Otp { get; set; }
    public string SecurityCode { get; set; }
    public string CardId { get; set; }
}