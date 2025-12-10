using CS.Contracts.GrpcClient.Contracts;
using CS.Contracts.GrpcClient.Contracts.Requests.Tariffs.TariffRequests;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using MediatR;

namespace CS.WebWallet.Business.Features.Tariffs;

public class ActivateTariffCommand : IRequest<Result>
{
    public string TariffId { get; }

    public ActivateTariffCommand(string tariffId)
    {
        TariffId = tariffId;
    }
}

public class ActivateTariffHandler : IRequestHandler<ActivateTariffCommand, Result>
{
    private readonly ITariffsService _tariffsService;
    private readonly ICurrentUserService _userService;

    public ActivateTariffHandler(ITariffsService tariffsService, ICurrentUserService userService)
    {
        _tariffsService = tariffsService;
        _userService = userService;
    }

    public Task<Result> Handle(ActivateTariffCommand request, CancellationToken cancellationToken)
    {
        return _tariffsService.AddTariffRequest(
            new AddTariffRequestRequest { TariffId = request.TariffId, ClientId = _userService.GetClientId() },
            cancellationToken).AsTask();
    }
}