using CS.Identity.Client.Services;
using CS.Loyalty.GrpcClient.Contracts;
using CS.Loyalty.GrpcClient.Contracts.Requests;
using CS.Loyalty.GrpcClient.Contracts.Responses;
using CS.Sdk.Commons.Models;
using CS.Sdk.Commons.Models.PagedRequest;
using CS.WebWallet.Business.Helpers;
using CS.WebWallet.Business.Models.Referrals;
using Mapster;
using MediatR;

namespace CS.WebWallet.Business.Features.Referrals;

public class GetReferralHistoryQuery : IRequest<PagedResult<ReferralHistoryDto>>
{
    public GetReferralHistoryQuery(PageContext<ReferralHistoryPageFilter> context)
    {
        Context = context;
    }

    public PageContext<ReferralHistoryPageFilter> Context { get; }
}

public class GetReferralHistoryQueryHandler : IRequestHandler<GetReferralHistoryQuery, PagedResult<ReferralHistoryDto>>
{
    private readonly IClientLoyaltyService _clientLoyaltyService;
    private readonly ICurrentUserService _userService;

    public GetReferralHistoryQueryHandler(
        IClientLoyaltyService clientLoyaltyService,
        ICurrentUserService userService)
    {
        _clientLoyaltyService = clientLoyaltyService;
        _userService = userService;
    }

    public async Task<PagedResult<ReferralHistoryDto>> Handle(
        GetReferralHistoryQuery request, CancellationToken cancellationToken)
    {
        var context = request.Context;
        var filter = context.Filter;
        var (from, to) = filter.From.GetRange(filter.To);
        var req = new GetReferralHistoryRequest
        {
            Page = context.PageIndex,
            Count = context.PageSize,
            To = to,
            From = from,
            Tags = filter.Tags,
            ClientId = _userService.GetClientId()
        };

        var response = await _clientLoyaltyService.GetReferralHistory(req, cancellationToken);

        return response.Success
            ? PagedResult<ReferralHistoryDto>
                .Ok((response.Data ?? new List<ReferralHistoryResponse>()).Select(a => a.Adapt<ReferralHistoryDto>()),
                    context.PageSize,
                    context.PageIndex,
                    response.Total)
            : PagedResult<ReferralHistoryDto>.Failed(response);
    }
}