using CS.Contracts.GrpcClient.Kyc.Contracts;
using CS.Contracts.GrpcClient.Kyc.Contracts.Shared;
using CS.Exchange.GrpcClient.Contracts;
using CS.Exchange.GrpcClient.Contracts.Responses.Exchange;
using CS.Exchange.RatesStore;
using cs.healthz.GrpcClient;
using CS.Identity.Client.Services;
using CS.Ledger.Client.MobileApi;
using CS.Ledger.Client.MobileApi.Contracts.Accounts.Requests;
using CS.Ledger.Client.MobileApi.Contracts.Accounts.Responses;
using CS.Ledger.Client.MobileApi.Contracts.Currencies.Responses;
using CS.Ledger.Contracts.Commons.Enums;
using CS.References.Contracts.Common.Enums;
using CS.References.GrpcClient.Contracts;
using CS.References.GrpcClient.Models.DisplayableMessages.Requests;
using CS.References.GrpcClient.Models.DisplayableMessages.Responses;
using CS.Sdk.Commons.Extensions;
using CS.Sdk.Commons.Models;
using CS.Sdk.Commons.Models.PagedRequest;
using CS.WebWallet.Business.Helpers;
using CS.WebWallet.Business.Models.Accounts;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace CS.WebWallet.Business.Features.Accounts;

public class GetAccountsFilter
{
    public List<Guid> Ids { get; set; }
}

public class GetAccountsPageQuery : IRequest<PagedResult<AccountRefDto>>
{
    public string FiatCurrency { get; set; } = "USD";
    public PageContext<GetAccountsFilter> Context { get; set; }
}

public class GetAccountsPageQueryHandler(
    IHttpContextAccessor accessor,
    IMobileApiService mobileApiService,
    IExchangeService exchangeService,
    IRatesStore ratesStore,
    ICurrentUserService currentUserService,
    IKycClientService clientService,
    IHealthzService healthz,
    ILogger<GetAccountsPageQueryHandler> logger,
    IDisplayableMessagesService displayableMessagesService)
    : IRequestHandler<GetAccountsPageQuery, PagedResult<AccountRefDto>>
{
    private const string DefaultLocale = "EN";

    public async Task<PagedResult<AccountRefDto>> Handle(
        GetAccountsPageQuery request,
        CancellationToken cancellationToken)
    {
        var alerts = (await GetAlerts(cancellationToken)).GroupBy(e => e.CurrencyId)
            .ToDictionary(e => e.Key, e => e.ToList());
        var supported = await GetExchanges();

        var clientId = currentUserService.GetClientId();
        var client = await clientService.GetShortStatus(
            new ClientIdRequest { ClientId = clientId }, cancellationToken);
        var getAccountsQueryContract = new GetAccountsRequest
        {
            OwnerId = clientId,
            Page = request.Context.PageIndex,
            Count = request.Context.PageSize,
            AccountIds = request.Context.Filter?.Ids
        };

        var response = await mobileApiService.GetAccounts(getAccountsQueryContract, cancellationToken);
        if (!response.Success)
        {
            logger.LogError("Failed to get accounts with {@Request} for {OwnerId}, message {@Message}",
                request,
                getAccountsQueryContract.OwnerId,
                response.Message);

            return PagedResult<AccountRefDto>.Failed(response);
        }

        var iso6391 = accessor.HttpContext?.Request.Headers["ww-lang"].ToString();
        var ids = response.Data?
            .Where(x => !string.IsNullOrWhiteSpace(x.DisplayableMessageId))
            .Select(x => x.DisplayableMessageId)
            .ToList() ?? new();

        var messages = new Dictionary<string, DisplayableMessageContentDto>();
        if (ids is { Count: > 0 })
        {
            messages = (await displayableMessagesService.GetContentForMessages(
                new GetContentForMessagesRequest
                {
                    Ids = ids,
                    Iso6391 = string.IsNullOrWhiteSpace(iso6391) ? DefaultLocale : iso6391.ToUpper(),
                    ApplicationType = ApplicationType.Backoffice,
                }, cancellationToken)).Data?.ToDictionary(e => e.DisplayableMessageId, e => e) ?? messages;
        }

        var accounts = new List<AccountRefDto>();
        foreach (var ledgerAccount in response.Data ?? new List<ClientAccountResponse>())
        {
            var balance = 0m;
            if (ledgerAccount.Balance != null)
                balance = ledgerAccount.Balance.Fact + ledgerAccount.Balance.Reserved;

            var getBalance = await GetBalance(balance, ledgerAccount.Currency, request.FiatCurrency, 2);
            messages.TryGetValue(ledgerAccount.DisplayableMessageId ?? string.Empty, out var message);
            var account = new AccountRefDto
            {
                Amount = balance.Format(ledgerAccount.Currency.Fraction),
                Name = ledgerAccount.Currency.Name,
                Ticker = ledgerAccount.Currency.Code,
                AccountId = ledgerAccount.Id,
                Fraction = ledgerAccount.Currency.Fraction,
                CurrencyId = ledgerAccount.Currency.Id,
                Type = (int)ledgerAccount.Type,
                Title = message?.Title ?? ledgerAccount.Currency.Title ?? ledgerAccount.Currency.Code,
                Text = message?.Text ?? ledgerAccount.Currency.Name ?? ledgerAccount.Currency.Code,
                CurrencyName = getBalance.FiatBalance.Symbol,
                CurrencySymbol = getBalance.Symbol ?? "N/A",
                CurrencyAmount = getBalance.FiatBalance.Amount,
                ExternalKey = client.Data?.Verified ?? false
                    ? ledgerAccount.ExternalId
                    : ledgerAccount.ExternalId?.MaskText(),
                IsCrypto = ledgerAccount.Type == AccountType.Crypto,
                Alerts = alerts.GetValueOrDefault(ledgerAccount.Currency.Id),
                Icon = ledgerAccount.Currency.IconUrl,
            };
            accounts.Add(account);
        }

        accounts.SetOperations(supported);
        return PagedResult<AccountRefDto>.Ok(accounts, response.Count, response.Page, response.Total);
    }

    private async Task<List<CurrencyAlertDto>> GetAlerts(CancellationToken token)
    {
        try
        {
            var alerts = await healthz.GetMaintenanceCurrencies(token);
            return alerts.Data?.Select(e => new CurrencyAlertDto
            {
                Level = (int)e.Level,
                Message = e.Message,
                CurrencyCode = e.Code,
                CurrencyId = e.CurrencyId
            }).ToList() ?? new List<CurrencyAlertDto>();
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Could not get alerts");
            return new List<CurrencyAlertDto>();
        }
    }

    private async Task<Dictionary<string, Dictionary<string, decimal>>> GetExchanges()
    {
        var result = new Dictionary<string, Dictionary<string, decimal>>();
        var supportedPairs = await exchangeService.AllSupportedAssets();
        if (!supportedPairs.Success) return result;

        return supportedPairs.Data.ToDictionary(
            e => e.Ticker,
            e => (e.Assets ?? new List<SupportedAssetResponse>()).ToDictionary(s => s.Asset, s => s.Rate));
    }

    private async Task<BalanceDto> GetBalance(
        decimal amount, ClientCurrencyResponse currency, string fiatCurrency, int fraction)
    {
        if (string.IsNullOrEmpty(currency?.Code))
            return null;

        if (string.IsNullOrEmpty(fiatCurrency))
            return null;

        var balanceAmount = 0m;
        try
        {
            balanceAmount = amount > 0
                ? currency.Code == fiatCurrency
                    ? amount
                    : await ratesStore.Calculate(currency.Code, fiatCurrency, amount)
                : 0;
        }
        catch (RateNotFoundException e)
        {
            logger.LogWarning("Rate: {Message}", e.Message);
        }

        var result = new BalanceDto
        {
            Amount = amount.Format(currency.Fraction),
            Symbol = currency.Symbol ?? currency.Title ?? currency.Code,
            FiatBalance = !string.IsNullOrWhiteSpace(fiatCurrency)
                          && !string.IsNullOrWhiteSpace(currency.Code)
                ? new BalanceFiatDto
                {
                    Symbol = fiatCurrency,
                    Amount = balanceAmount.Format(fraction)
                }
                : null
        };

        return result;
    }
}