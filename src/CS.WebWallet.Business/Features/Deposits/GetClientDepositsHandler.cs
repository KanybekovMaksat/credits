using CS.Contracts.Contracts.Commons.Enums;
using CS.Contracts.GrpcClient.Contracts;
using CS.Contracts.GrpcClient.Contracts.Requests.Deposits;
using CS.Exchange.RatesStore;
using CS.Identity.Client.Services;
using CS.Ledger.Client.MobileApi;
using CS.Ledger.Client.MobileApi.Contracts.Accounts.Requests;
using CS.Ledger.Stores;
using CS.Sdk.Commons.Extensions;
using CS.Sdk.Commons.Models;
using Mapster;
using MediatR;

namespace CS.WebWallet.Business.Features.Deposits;

public class GetClientDepositsQuery : IRequest<Result<ClientDepositsInfoDto>>
{
    public bool ShowClosed { get; set; }
}

public class GetClientDepositsHandler(
    IContractsDepositsService depositsService,
    IMobileApiService mobileApiService,
    ICurrentUserService currentUser,
    ICurrenciesStore store,
    IRatesStore rates) : IRequestHandler<GetClientDepositsQuery, Result<ClientDepositsInfoDto>>
{
    public async Task<Result<ClientDepositsInfoDto>> Handle(GetClientDepositsQuery request, CancellationToken token)
    {
        var clientId = currentUser.GetClientId();
        var req = new GetClientDepositsMobileRequest
        {
            ClientId = clientId,
            ShowClosed = true,
        };

        var response = await depositsService.GetClientDepositsMobile(req, token);

        if (!response.Success)
            return Result<ClientDepositsInfoDto>.Failed(response);

        var data = response.Data;
        if (data.Deposits == null || data.Deposits.Count == 0)
            return Result<ClientDepositsInfoDto>.Ok(null);

        var accountIds = data.Deposits.SelectMany(a => new[] { a.DepositAccountId, a.InterestAccountId })
            .Distinct().ToList();

        var accounts = await mobileApiService.GetAccounts(
            new GetAccountsRequest { AccountIds = accountIds, OwnerId = clientId, Page = 1, Count = accountIds.Count },
            token);

        if (!accounts.Success)
            return Result<ClientDepositsInfoDto>.Failed(accounts);

        if (accounts.Data == null)
            return Result<ClientDepositsInfoDto>.Ok(null);

        var baseCurrency = await store.GetBaseCurrency();
        var currencies = await store.GetAll();

        var activeAmount = 0m;
        var closedAmount = 0m;

        if (data.Amounts is { Count: > 0 })
        {
            foreach (var amountDto in data.Amounts)
            {
                var currency = currencies.First(a => a.Id == amountDto.CurrencyId);
                var value = await rates.Calculate(currency.Code, baseCurrency.Code, amountDto.Amount);

                if (amountDto.Status is DepositStatus.Active or DepositStatus.Closing)
                    activeAmount += amountDto.Amount * value;
                else
                    closedAmount += amountDto.Amount * value;
            }
        }

        var result = new ClientDepositsInfoDto
        {
            ActiveAmount = new ValueDto(activeAmount, activeAmount.Format(baseCurrency.Fraction), baseCurrency.Code),
            ClosedAmount = new ValueDto(closedAmount, closedAmount.Format(baseCurrency.Fraction), baseCurrency.Code),
            Deposits = data.Deposits.Select(e =>
            {
                var depositAccount = accounts.Data.FirstOrDefault(c => c.Id == e.DepositAccountId);
                var interestAccount = accounts.Data.FirstOrDefault(c => c.Id == e.InterestAccountId);
                var currency = currencies.FirstOrDefault(c => c.Id == e.CurrencyId);

                if (currency == null) return null;

                return new ClientDepositDto
                {
                    Id = e.Id,
                    Currency = currency.Adapt<CurrencyDto>(),
                    DepositDate = e.DepositDate,
                    ExpireDate = e.ExpireDate,
                    Status = e.Status,
                    DepositAccount = depositAccount == null
                        ? null
                        : new DepositAccountDto
                        {
                            Id = depositAccount.Id,
                            Icon = depositAccount.Currency.IconUrl,
                            Type = (int)depositAccount.Type,
                            Code = depositAccount.Currency.Code,
                            Amount = new ValueDto(
                                Math.Abs(depositAccount.Balance.Fact),
                                Math.Abs(depositAccount.Balance.Fact).Format(currency.Fraction),
                                depositAccount.Currency.Code)
                        },
                    InterestAccount = interestAccount == null
                        ? null
                        : new DepositAccountDto
                        {
                            Id = interestAccount.Id,
                            Icon = interestAccount.Currency.IconUrl,
                            Type = (int)interestAccount.Type,
                            Code = interestAccount.Currency.Code,
                            Amount = new ValueDto(
                                interestAccount.Balance.Fact,
                                interestAccount.Balance.Fact.Format(currency.Fraction),
                                interestAccount.Currency.Code)
                        },
                    NextInterestDate = e.NextInterestDate,
                    NextInterestAmount = new ValueDto(
                        e.NextInterestAmount, e.NextInterestAmount.Format(currency.Fraction), currency.Code),
                    InterestPaid =
                        new ValueDto(e.InterestPaid, e.InterestPaid.Format(currency.Fraction), currency.Code),
                    TotalInterest = new ValueDto(e.TotalInterest, e.TotalInterest.Format(currency.Fraction),
                        currency.Code),
                };
            }).Where(e => e != null).ToList()
        };

        return Result<ClientDepositsInfoDto>.Ok(result);
    }
}

public class ClientDepositsInfoDto
{
    public ValueDto ActiveAmount { get; set; }
    public ValueDto ClosedAmount { get; set; }
    public List<ClientDepositDto> Deposits { get; set; }
}

public class DepositAccountDto
{
    public Guid Id { get; set; }
    public string Icon { get; set; }
    public string Code { get; set; }
    public int Type { get; set; }
    public ValueDto Amount { get; set; }
}

public class ClientDepositDto
{
    public string Id { get; set; }
    public DepositStatus Status { get; set; }
    public DepositAccountDto DepositAccount { get; set; }
    public DepositAccountDto InterestAccount { get; set; }
    public CurrencyDto Currency { get; set; }
    public ValueDto NextInterestAmount { get; set; }
    public DateTime NextInterestDate { get; set; }
    public DateTime DepositDate { get; set; }
    public DateTime ExpireDate { get; set; }
    public ValueDto TotalInterest { get; set; }
    public ValueDto InterestPaid { get; set; }
}