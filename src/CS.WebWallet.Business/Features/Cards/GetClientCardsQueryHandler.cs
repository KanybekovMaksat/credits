using CS.AntiFraud.Commons.Enums;
using CS.AntiFraud.GrpcClient.Contracts;
using CS.AntiFraud.GrpcClient.Contracts.Requests.AntiFraud;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Extensions;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Cards;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CS.WebWallet.Business.Features.Cards;

public class GetClientCardsQuery : IRequest<ResultList<ClientCardDto>>
{
}

public class GetClientCardsQueryHandler : IRequestHandler<GetClientCardsQuery, ResultList<ClientCardDto>>
{
    private readonly IAntiFraudClientService _antiFraudService;
    private readonly ICurrentUserService _userService;
    private readonly ILogger<GetClientCardsQueryHandler> _logger;

    public GetClientCardsQueryHandler(
        IAntiFraudClientService antiFraudService,
        ICurrentUserService userService,
        ILogger<GetClientCardsQueryHandler> logger)
    {
        _antiFraudService = antiFraudService;
        _userService = userService;
        _logger = logger;
    }

    public async Task<ResultList<ClientCardDto>> Handle(
        GetClientCardsQuery request, CancellationToken cancellationToken)
    {
        var clientId = _userService.GetClientId();
        var cards = await _antiFraudService.GetStoredCards(
            new GetStoredCardsRequest { Page = 1, Count = int.MaxValue, ClientId = clientId },
            cancellationToken);

        if (cards.Success)
            return ResultList<ClientCardDto>.Ok(cards.Data?.Where(e => !e.IsDeleted).Select(e =>
                new ClientCardDto
                {
                    Id = e.Id,
                    IsVerified = e.Status == CardStatus.Active,
                    MaskedPan = e.MaskedPan.MaskCardNumber(),
                    Holder = e.HolderName,
                    Status = ToStatus(e.Status),
                }) ?? new List<ClientCardDto>());

        _logger.LogWarning("Could not get client's {Id} cards list: {Message}", clientId, cards.Message);
        return ResultList<ClientCardDto>.Failed(cards);
    }

    private static ClientCardStatus ToStatus(CardStatus status)
        => status switch
        {
            CardStatus.New => ClientCardStatus.NotVerified,
            CardStatus.Active => ClientCardStatus.Verified,
            CardStatus.Expired => ClientCardStatus.Expired,
            CardStatus.Blocked => ClientCardStatus.Blocked,
            CardStatus.Moderation => ClientCardStatus.Moderation,
            _ => ClientCardStatus.NotVerified
        };
}