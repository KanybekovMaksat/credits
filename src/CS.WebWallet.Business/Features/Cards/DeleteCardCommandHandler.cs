using CS.Identity.Client.Services;
using CS.Orchestrator.GrpcClient;
using CS.Orchestrator.GrpcClient.Cards.Requests;
using CS.Sdk.Commons.Models;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CS.WebWallet.Business.Features.Cards;

public class DeleteCardCommand : IRequest<Result>
{
    public DeleteCardCommand(string cardId)
    {
        CardId = cardId;
    }

    public string CardId { get; }
}

public class DeleteCardCommandHandler : IRequestHandler<DeleteCardCommand, Result>
{
    private readonly ICardService _cardService;
    private readonly ICurrentUserService _userService;
    private readonly ILogger<DeleteCardCommandHandler> _logger;

    public DeleteCardCommandHandler(
        ICardService cardService,
        ICurrentUserService userService,
        ILogger<DeleteCardCommandHandler> logger)
    {
        _cardService = cardService;
        _userService = userService;
        _logger = logger;
    }

    public async Task<Result> Handle(DeleteCardCommand request, CancellationToken cancellationToken)
    {
        var result = await _cardService.RemoveCards(new RemoveCardsRequest
        {
            CardId = request.CardId,
            ClientId = _userService.GetClientId()
        }, cancellationToken);

        if (!result.Success)
        {
            _logger.LogWarning("Could not get card {Id} not found: {Message}", request.CardId, result.Message);
            return Result.Failed(result);
        }

        _logger.LogWarning("Could not remove client card from app");
        return Result.Failed(result);
    }
}