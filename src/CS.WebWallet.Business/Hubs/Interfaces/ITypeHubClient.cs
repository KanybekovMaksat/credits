using CS.WebWallet.Business.Models.Hubs;

namespace CS.WebWallet.Business.Hubs.Interfaces;

public interface ITypedHubClient
{
    Task BroadcastRate(HubCurrencyRateModel model);
}