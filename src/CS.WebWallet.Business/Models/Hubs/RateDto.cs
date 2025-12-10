namespace CS.WebWallet.Business.Models.Hubs;

public record HubCurrencyRateModel(List<RateDto> Rates);

public record RateDto(
    string Base,
    string Quoted,
    decimal Rate);