using CS.Banking.Commons.Enums;
using CS.Banking.GrpcClient.Contracts;
using CS.Banking.GrpcClient.Contracts.Requests.Cards;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Cards;
using Mapster;
using MediatR;

namespace CS.WebWallet.Business.Features.Cards;

public class ActivateIssuedCardCommand : IRequest<Result<ChangeCardStatusDto>>
{
    public string CardId { get; set; }
}

public class ActivateIssuedCardCommandHandler : IRequestHandler<ActivateIssuedCardCommand, Result<ChangeCardStatusDto>>
{
    private readonly ICurrentUserService _userService;
    private readonly IBankCustomersService _bankService;

    public ActivateIssuedCardCommandHandler(ICurrentUserService userService, IBankCustomersService bankService)
    {
        _userService = userService;
        _bankService = bankService;
    }

    public async Task<Result<ChangeCardStatusDto>> Handle(
        ActivateIssuedCardCommand request, CancellationToken cancellationToken)
    {
        var result = await _bankService.ChangeCardStatus(
            new ChangeCardStatusRequest
            {
                CardId = request.CardId,
                Status = CardStatus.Active,
                ClientId = _userService.GetClientId()
            }, cancellationToken);

        return result.Success
            ? Result<ChangeCardStatusDto>.Ok(new ChangeCardStatusDto
            {
                NewStatus = (int)result.Data.NewStatus,
                Url = result.Data.Url,
                RequestKey = result.Data.RequestKey,
                RequiresConfirmation = result.Data.RequiresConfirmation
            })
            : Result<ChangeCardStatusDto>.Failed(result);
    }
}