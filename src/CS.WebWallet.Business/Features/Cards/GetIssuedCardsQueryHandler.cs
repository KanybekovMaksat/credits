using CS.Banking.GrpcClient.Contracts;
using CS.Banking.GrpcClient.Contracts.Requests.Cards;
using CS.Banking.GrpcClient.Contracts.Responses.Cards;
using CS.Exchange.RatesStore;
using CS.Identity.Client.Services;
using CS.Ledger.Client.MobileApi;
using CS.Ledger.Client.MobileApi.Contracts.Accounts;
using CS.Ledger.Client.MobileApi.Contracts.Accounts.Requests;
using CS.Ledger.Client.MobileApi.Contracts.Accounts.Responses;
using CS.Ledger.Contracts.Commons.Enums;
using CS.Sdk.Commons.Extensions;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Accounts;
using CS.WebWallet.Business.Models.Cards;
using Mapster;
using MediatR;

namespace CS.WebWallet.Business.Features.Cards;

public class GetIssuedCardsQuery : IRequest<ResultList<IssuedCardDto>>
{
}

public class GetIssuedCardsQueryHandler : IRequestHandler<GetIssuedCardsQuery, ResultList<IssuedCardDto>>
{
    private readonly ICurrentUserService _userService;
    private readonly IBankCustomersService _bankService;
    private readonly IMobileApiService _ledgerService;
    private readonly IRatesStore _ratesStore;

    public GetIssuedCardsQueryHandler(
        ICurrentUserService userService,
        IBankCustomersService bankService,
        IMobileApiService ledgerService,
        IRatesStore ratesStore)
    {
        _userService = userService;
        _bankService = bankService;
        _ledgerService = ledgerService;
        _ratesStore = ratesStore;
    }

    public async Task<ResultList<IssuedCardDto>> Handle(
        GetIssuedCardsQuery request, CancellationToken cancellationToken)
    {
        var clientId = _userService.GetClientId();
        var cards = await _bankService.GetCards(new GetCardsRequest
        {
            Page = 1,
            Count = int.MaxValue,
            ClientId = clientId
        }, cancellationToken);

        if (!cards.Success)
            return ResultList<IssuedCardDto>.Failed(cards);

        if (cards.Data is null || !cards.Data.Any())
            return ResultList<IssuedCardDto>.Ok(new List<IssuedCardDto>());

        var balances = (await _ledgerService.GetBalances(
            new GetBalancesRequest
            {
                OwnerId = clientId,
                AccountIds = cards.Data.Select(e => e.InternalAccountId).ToList()
            }, cancellationToken)).Data?.ToList() ?? new List<BalanceResponse>();

        var rates = new Dictionary<string, decimal>();
        var result = new List<IssuedCardDto>();

        foreach (var currency in cards.Data.Select(e => e.Currency.ToUpper()).Distinct())
        {
            try
            {
                rates.TryAdd(currency, await _ratesStore.Calculate(currency, "USD", 1));
            }
            catch
            {
                rates.TryAdd(currency, 1);
            }
        }

        foreach (var card in cards.Data
                     .Where(a => !balances.Any() || balances
                         .Where(b => b.Status is not (AccountStatus.Prepared or AccountStatus.Undefined
                             or AccountStatus.Closed))
                         .Select(c => c.Id).Contains(a.InternalAccountId)))
        {
            var dto = card.Adapt<IssuedCardDto>();

            var amount = balances.FirstOrDefault(e => e.Id == card.InternalAccountId)?.Fact ?? 0m;
            dto.Balance = new BalanceDto
            {
                Amount = amount.Format(),
                Symbol = card.Currency,
                FiatBalance = new BalanceFiatDto
                {
                    Amount = (amount * rates[card.Currency.ToUpper()]).Format(),
                    Symbol = "USD"
                }
            };

            result.Add(dto);
        }

        return ResultList<IssuedCardDto>.Ok(result);
    }
}