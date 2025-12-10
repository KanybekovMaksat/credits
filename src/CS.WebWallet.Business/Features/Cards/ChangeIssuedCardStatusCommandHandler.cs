using CS.Banking.Commons.Enums;
using CS.Banking.GrpcClient.Contracts;
using CS.Banking.GrpcClient.Contracts.Requests.Cards;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using FluentValidation;
using MediatR;

namespace CS.WebWallet.Business.Features.Cards;

public class ChangeIssuedCardStatusCommand : IRequest<Result>
{
    public string CardId { get; set; }
    public int NewStatus { get; set; }
}

public class ChangeIssuedCardStatusValidator : AbstractValidator<ChangeIssuedCardStatusCommand>
{
    public ChangeIssuedCardStatusValidator()
    {
        RuleFor(e => e.CardId).NotEmpty().WithMessage("Card is not specified");
        RuleFor(e => e.NewStatus)
            .Must(e => (CardStatus)e is CardStatus.Active or CardStatus.Blocked or CardStatus.Ejected);
    }
}

public class ChangeIssuedCardStatusCommandHandler : IRequestHandler<ChangeIssuedCardStatusCommand, Result>
{
    private readonly IBankCustomersService _bankService;
    private readonly ICurrentUserService _userService;

    public ChangeIssuedCardStatusCommandHandler(
        IBankCustomersService bankService,
        ICurrentUserService userService)
    {
        _bankService = bankService;
        _userService = userService;
    }

    public async Task<Result> Handle(ChangeIssuedCardStatusCommand request, CancellationToken cancellationToken)
    {
        var result = await _bankService.ChangeCardStatus(
            new ChangeCardStatusRequest
            {
                CardId = request.CardId,
                ClientId = _userService.GetClientId(),
                Status = (CardStatus)request.NewStatus,
            }, cancellationToken);

        return result.Success ? Result.Ok() : Result.Failed(result);
    }
}