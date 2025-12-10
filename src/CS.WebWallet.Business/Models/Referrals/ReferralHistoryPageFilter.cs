namespace CS.WebWallet.Business.Models.Referrals;

public class ReferralHistoryPageFilter
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public List<string> Tags { get; set; }
}