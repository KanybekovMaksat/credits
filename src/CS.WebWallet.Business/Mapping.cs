using CS.Contracts.GrpcClient.Kyc.Contracts.Shared;
using CS.Ledger.Client.MobileApi.Contracts.Currencies.Responses;
using CS.Orchestrator.Contracts.Common.Models;
using CS.Sdk.Commons.Extensions;
using CS.WebWallet.Business.Models.Accounts;
using CS.WebWallet.Business.Models.Kyc.v2;
using Mapster;

namespace CS.WebWallet.Business;

public class Mapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ClientCurrencyResponse, CurrencyDto>()
            .Ignore(src => src.Id);
        
        config.NewConfig<KycClientAddressResponse, KycClientAddressDto>()
            .Map(e => e.PostalCode, e => e.PostCode);

        config.NewConfig<AmountDto, string>()
            .MapWith(e => e == null ? "0.00" : $"{e.Amount.Format(e.Fraction)} {(string.IsNullOrWhiteSpace(e.Symbol) ? e.Code : e.Symbol)}");
    }
}