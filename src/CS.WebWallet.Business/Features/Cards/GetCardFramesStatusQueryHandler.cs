using CS.Banking.GrpcClient.Contracts;
using CS.Banking.GrpcClient.Contracts.Requests.Cards;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using MediatR;

namespace CS.WebWallet.Business.Features.Cards;

public class GetCardFramesStatusQuery : IRequest<Result<bool>>
{
    public string CardId { get; }

    public GetCardFramesStatusQuery(string cardId)
    {
        CardId = cardId;
    }
}

public class GetCardFramesStatusQueryHandler : IRequestHandler<GetCardFramesStatusQuery, Result<bool>>
{
    private readonly ICurrentUserService _userService;
    private readonly IBankCustomersService _customersService;

    public GetCardFramesStatusQueryHandler(
        ICurrentUserService userService,
        IBankCustomersService customersService)
    {
        _userService = userService;
        _customersService = customersService;
    }

    public async Task<Result<bool>> Handle(GetCardFramesStatusQuery request, CancellationToken cancellationToken)
    {
        var result = await _customersService.GetBankCardFrameSetting(
            new GetBankCardFrameSettingRequest { CardId = request.CardId, ClientId = _userService.GetClientId() },
            cancellationToken);
        return result.Success ? Result<bool>.Ok(!result.Data) : result;
    }
}