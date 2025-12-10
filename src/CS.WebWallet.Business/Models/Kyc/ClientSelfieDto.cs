using Microsoft.AspNetCore.Http;

namespace CS.WebWallet.Business.Models.Kyc;

public class ClientSelfieDto
{
    public string Code { get; set; }
    public IFormFile File { get; set; }
}