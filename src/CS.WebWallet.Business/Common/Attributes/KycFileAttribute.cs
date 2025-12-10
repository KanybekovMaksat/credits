using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace CS.WebWallet.Business.Common.Attributes;

public class KycFileAttribute : ValidationAttribute
{
    public bool AllowEmpty { get; set; }
    public bool AllowPdf { get; set; }

    /// <summary>
    /// </summary>
    /// <param name="value"></param>
    /// <returns></returns>
    public override bool IsValid(object value)
    {
        ErrorMessage = string.Empty;
        switch (value)
        {
            case null when AllowEmpty:
                return true;
            case null:
                ErrorMessage = "No KYC file found";
                return false;
            case IFormFileCollection collection
                when collection.All(file =>
                    file != null && (file.ContentType.StartsWith("image") ||
                                     AllowPdf && file.ContentType == "application/pdf")):
                return true;
            case IFormFile file when file.ContentType.StartsWith("image") ||
                                     AllowPdf && file.ContentType == "application/pdf":
                return true;
            default:
                ErrorMessage = "One of provided files is not an image or PDF";
                return false;
        }
    }
}