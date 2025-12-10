using CS.Contracts.Contracts.Commons.Enums.Kyc;
using CS.WebWallet.Business.Common.Attributes;
using Microsoft.AspNetCore.Http;

namespace CS.WebWallet.Business.Models.Kyc.v2;

/// <summary>
///     Request model for screen: document to verify - mobile app
/// </summary>
public class AddKycDocumentsRequest
{
    public int StageId { get; set; }
    [KycFile(AllowPdf = true)] public IFormFile Front { get; set; }

    [KycFile(AllowPdf = true, AllowEmpty = true)]
    public IFormFile Back { get; set; }

    public KycDocumentType DocumentType { get; set; }
}