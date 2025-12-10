using CS.Orchestrator.Contracts.Common.Models;
using CS.Sdk.Commons.Extensions;
using CS.WebWallet.Business.Models.Transfers.Crypto;

namespace CS.WebWallet.Business.Helpers;

internal static class ApiCallsExtensions
{
    public static CurrencySizeDto FromGrpc(this AmountDto amountDto)
        => new()
        {
            Size = amountDto.Amount.Format(amountDto.Fraction),
            Id = amountDto.CurrencyId,
            Ticker = amountDto.Code
        };
}