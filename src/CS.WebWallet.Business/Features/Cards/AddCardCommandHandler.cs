using CS.Identity.Client.Services;
using CS.Orchestrator.GrpcClient;
using CS.Orchestrator.GrpcClient.Cards.Requests;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Cards;
using CS.WebWallet.Business.Models.Payments;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CS.WebWallet.Business.Features.Cards;

public class AddCardCommand : IRequest<Result<ClientCardDto>>
{
    public AddCardCommand(CardDetailsDto card)
    {
        Card = card;
    }

    public CardDetailsDto Card { get; }
}

public class AddCardValidator : AbstractValidator<AddCardCommand>
{
    public AddCardValidator()
    {
        RuleFor(e => e.Card).NotNull().WithMessage("Please set card data");
        RuleFor(e => e.Card.Number).NotEmpty().WithMessage("Card number should be set");
        RuleFor(e => e.Card.HolderName).NotEmpty().WithMessage("Card holder should be set");
        RuleFor(e => e.Card.ExpireMonth).NotEmpty().WithMessage("Expiry month should be set");
        RuleFor(e => e.Card.ExpireYear).NotEmpty().WithMessage("Expiry year should be set");
    }
}

public class AddCardCommandHandler : IRequestHandler<AddCardCommand, Result<ClientCardDto>>
{
    private readonly ICardService _flowService;
    private readonly ILogger<AddCardCommandHandler> _logger;
    private readonly ICurrentUserService _userService;

    public AddCardCommandHandler(
        ICardService flowService,
        ICurrentUserService userService,
        ILogger<AddCardCommandHandler> logger)
    {
        _flowService = flowService;
        _userService = userService;
        _logger = logger;
    }

    public async Task<Result<ClientCardDto>> Handle(AddCardCommand request, CancellationToken cancellationToken)
    {
        var number = request.Card.Number.Replace(" ", string.Empty).Trim();
        if (number.Length != 16)
            return Result<ClientCardDto>.Bad("Card number length should be 16 digits");

        var result = await _flowService.AddCard(new AddCardRequest
        {
            Number = number,
            ClientId = _userService.GetClientId(),
            ExpireMonth = request.Card.ExpireMonth,
            ExpireYear = request.Card.ExpireYear,
            HolderName = request.Card.HolderName,
        }, cancellationToken);

        if (result.Success)
        {
            if (string.IsNullOrWhiteSpace(result.Data.ErrorMessage))
                return Result<ClientCardDto>.Ok(new ClientCardDto
                {
                    Id = result.Data.CardId,
                    MaskedPan = request.Card.Number[^4..],
                    Holder = request.Card.HolderName,
                });

            _logger.LogWarning("Could not add new card: {Message}, {@Failures}",
                result.Data.ErrorMessage, result.Data.Failures);
            return Result<ClientCardDto>.Bad(result.Data.ErrorMessage);
        }

        _logger.LogWarning("Could not add client card");
        return Result<ClientCardDto>.Failed(result);
    }
}