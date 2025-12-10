namespace CS.WebWallet.Business.Models.Reports;

public class FileResponse
{
    public Stream Stream { get; set; }
    public byte[] Blob { get; set; }
    public string MimeType { get; set; }
    public string Name { get; set; }
}