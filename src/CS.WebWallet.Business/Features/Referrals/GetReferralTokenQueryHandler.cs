using CS.Identity.Client.Services;
using CS.Loyalty.GrpcClient.Contracts;
using CS.Loyalty.GrpcClient.Contracts.Requests;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Referrals;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CS.WebWallet.Business.Features.Referrals;

public class GetReferralTokenQuery : IRequest<Result<ClientReferralDataDto>>
{
}

public class GetReferralTokenQueryHandler : IRequestHandler<GetReferralTokenQuery, Result<ClientReferralDataDto>>
{
    private readonly ICurrentUserService _userService;
    private readonly IClientLoyaltyService _loyaltyService;
    private readonly ILogger<GetReferralTokenQueryHandler> _logger;

    public GetReferralTokenQueryHandler(
        ICurrentUserService userService,
        IClientLoyaltyService loyaltyService,
        ILogger<GetReferralTokenQueryHandler> logger)
    {
        _userService = userService;
        _loyaltyService = loyaltyService;
        _logger = logger;
    }


    public async Task<Result<ClientReferralDataDto>> Handle(
        GetReferralTokenQuery request, CancellationToken cancellationToken)
    {
        var clientId = _userService.GetClientId();
        var result = await _loyaltyService.GetClientReferralToken(
            new GetClientReferralTokenRequest { ClientId = clientId }, cancellationToken);

        if (result.Success)
            return Result<ClientReferralDataDto>.Ok(new ClientReferralDataDto
            {
                Token = result.Data.ReferralToken,
                ReferralUrl = result.Data.ReferralUrl,
            });

        _logger.LogWarning("Could not get referral token: {Message}", result.Message);
        return Result<ClientReferralDataDto>.Failed(result);
    }
}