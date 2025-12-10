namespace CS.WebWallet.Business.Models.Cards;

public enum ClientCardStatus
{
    NotVerified = 1,
    Verified,
    Expired,
    Blocked,
    Moderation
}

public class ClientCardRefDto
{
    public bool IsVerified { get; set; }
    public string Id { get; set; }
}

public class ClientCardDto : ClientCardRefDto
{
    public string Url { get; set; }
    public string MaskedPan { get; set; }
    public string Holder { get; set; }
    public ClientCardStatus Status { get; set; }
}