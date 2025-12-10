using CS.Contracts.Contracts.Commons.Enums;
using CS.Contracts.GrpcClient.Contracts;
using CS.Contracts.GrpcClient.Contracts.Requests.Deposits;
using CS.Contracts.GrpcClient.Contracts.Responses.Deposits.Shared;
using CS.Identity.Client.Services;
using CS.Ledger.Stores;
using CS.Ledger.Stores.Models;
using CS.Sdk.Commons.Extensions;
using CS.Sdk.Commons.Models;
using Mapster;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CS.WebWallet.Business.Features.Deposits;

public class GetDepositConstructorQuery : IRequest<Result<DepositConstructorDto>>
{
    public int? ShowcaseItemId { get; set; }
    public UpdateParams Updates { get; set; }
}

public class UpdateParams
{
    public bool AllowReplenish { get; set; }
    public bool AllowWithdraw { get; set; }
    public bool InterestOnDepositAccount { get; set; }
    public bool IsDefault { get; set; }
    public int CurrencyId { get; set; }
    public DepositPeriodDto Period { get; set; }
    public decimal Amount { get; set; }
}

public class DepositConstructorDto
{
    public List<CurrencyDto> Currencies { get; set; }
    public List<DepositPeriodDto> Periods { get; set; }
    public ValueDto MinAmount { get; set; }
    public ValueDto MaxAmount { get; set; }
    public FlagDto AllowReplenish { get; set; }
    public FlagDto AllowWithdraw { get; set; }
    public FlagDto InterestOnDepositAccount { get; set; }
    public SelectedDepositDto Deposit { get; set; }
}

public class SelectedDepositDto
{
    public string Id { get; set; }
    public string AnnualPercent { get; set; }
    public string InitialAnnualPercent { get; set; }
    public string FullAmount { get; set; }
    public string InterestAmount { get; set; }
    public CurrencyDto Currency { get; set; }
    public DepositPeriodDto Period { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
}

public record ValueDto(decimal Amount, string Formated, string Currency);

public record FlagDto(bool Value, bool IsLocked);

public class DepositPeriodDto
{
    public PeriodUnit Period { get; set; }
    public int Count { get; set; }
}

public class CurrencyDto
{
    public int Id { get; set; }
    public string IconUrl { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
}

public class GetDepositsConstructorHandler(
    IContractsDepositsService depositsService,
    ICurrentUserService currentUser,
    ICurrenciesStore store,
    ILogger<GetDepositsConstructorHandler> logger)
    : IRequestHandler<GetDepositConstructorQuery, Result<DepositConstructorDto>>
{
    public async Task<Result<DepositConstructorDto>> Handle(GetDepositConstructorQuery request, CancellationToken token)
    {
        var req = new GetDepositConstructorRequest
        {
            ShowcaseItemId = request.ShowcaseItemId,
            ClientId = currentUser.GetClientId(),
            AllowWithdraw = request.Updates?.AllowWithdraw ?? false,
            AllowReplenish = request.Updates?.AllowReplenish ?? false,
            InterestOnDepositAccount = request.Updates?.InterestOnDepositAccount ?? false,
            IsDefault = request.Updates?.IsDefault ?? false,
            Amount = request.Updates?.Amount ?? 0m,
            Period = request.Updates?.Period?.Adapt<DepositPeriodModel>(),
            CurrencyId = request.Updates?.CurrencyId ?? 0,
        };

        var response = await depositsService.GetDepositConstructor(req, token);
        if (!response.Success)
        {
            logger.LogError("Couldn't get deposit constructor. {@Request} {Message}", req, response.Message);
            return Result<DepositConstructorDto>.Failed(response);
        }

        if (response.Data == null)
        {
            logger.LogError("Couldn't get deposit constructor. {@Request} - no data", req);
            return Result<DepositConstructorDto>.Failed("No data");
        }

        var data = response.Data;
        var currencies = (await store.GetAll()).ToDictionary(e => e.Id);
        var currency = currencies[data.Deposit.CurrencyId];
        var result = new DepositConstructorDto
        {
            AllowReplenish = data.AllowReplenish.Adapt<FlagDto>(),
            AllowWithdraw = data.AllowWithdraw.Adapt<FlagDto>(),
            InterestOnDepositAccount = data.InterestOnDepositAccount.Adapt<FlagDto>(),
            MinAmount = new ValueDto(data.MinAmount, data.MinAmount.Format(currency.Fraction), currency.Code),
            MaxAmount = new ValueDto(data.MaxAmount, data.MaxAmount.Format(currency.Fraction), currency.Code),
            Periods = (data.Periods ?? []).Select(a => a.Adapt<DepositPeriodDto>()).ToList(),
            Deposit = new SelectedDepositDto
            {
                Id = data.Deposit.Id,
                InitialAnnualPercent = data.Deposit.InitialAnnualPercent.Format(),
                AnnualPercent = data.Deposit.AnnualPercent.Format(),
                FromDate = data.Deposit.FromDate,
                ToDate = data.Deposit.ToDate,
                FullAmount = data.Deposit.FullAmount.Format(currency.Fraction),
                InterestAmount = data.Deposit.InterestAmount.Format(currency.Fraction),
                Period = data.Deposit.Period.Adapt<DepositPeriodDto>(),
                Currency = MapToDto(currency),
            },
            Currencies = (data.Currencies ?? []).Select(e => MapToDto(currencies[e])).ToList(),
        };

        return Result<DepositConstructorDto>.Ok(result);
    }

    private static CurrencyDto MapToDto(StoredCurrency src)
        => new()
        {
            Id = src.Id,
            Code = src.Code,
            Name = src.Name ?? src.Code,
            IconUrl = src.IconUrl,
        };
}