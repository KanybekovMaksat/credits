using CS.Banking.GrpcClient.Contracts;
using CS.Banking.GrpcClient.Contracts.Requests.Cards;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Cards;
using Mapster;
using MediatR;

namespace CS.WebWallet.Business.Features.Cards;

public class SetIssuedCardPinCommand : IRequest<Result<CardFrameUrlDto>>
{
    public string CardId { get; set; }
}

public class SetIssuedCardPinCommandHandler : IRequestHandler<SetIssuedCardPinCommand, Result<CardFrameUrlDto>>
{
    private readonly IBankCustomersService _customersService;
    private readonly ICurrentUserService _userService;

    public SetIssuedCardPinCommandHandler(
        IBankCustomersService customersService,
        ICurrentUserService userService)
    {
        _customersService = customersService;
        _userService = userService;
    }

    public async Task<Result<CardFrameUrlDto>> Handle(
        SetIssuedCardPinCommand request, CancellationToken cancellationToken)
    {
        var result = await _customersService.SetCardPin(
            new ClientCardRequest { CardId = request.CardId, ClientId = _userService.GetClientId() },
            cancellationToken);

        return result.Success
            ? Result<CardFrameUrlDto>.Ok(result.Data.Adapt<CardFrameUrlDto>())
            : Result<CardFrameUrlDto>.Failed(result);
    }
}