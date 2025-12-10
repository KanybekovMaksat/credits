using Microsoft.AspNetCore.Http;

namespace CS.WebWallet.Business.Models.Kyc;

public class ClientDocumentDto
{
    public int Type { get; set; }
    public IFormFile Front { get; set; }
    public IFormFile Back { get; set; }
}