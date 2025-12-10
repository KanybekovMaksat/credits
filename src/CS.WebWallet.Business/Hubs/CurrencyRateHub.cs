using CS.WebWallet.Business.Hubs.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace CS.WebWallet.Business.Hubs;

[Authorize]
public class CurrencyRateHub : Hub<ITypedHubClient>
{
}