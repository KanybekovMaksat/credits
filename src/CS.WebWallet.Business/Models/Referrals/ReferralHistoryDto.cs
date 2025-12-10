using CS.Loyalty.Contracts.Attributes.Enums;
using CS.Loyalty.GrpcClient.Contracts.Responses;

namespace CS.WebWallet.Business.Models.Referrals;

public class ReferralHistoryDto
{
    public Guid Id { get; set; }
    public string ReferralToken { get; set; }
    public ReferralStatus ReferralStatus { get; set; }
    public DateTime Created { get; set; }
    public List<ReferralHistoryParamResponse> Params { get; set; }
}