using CS.Contracts.GrpcClient.Contracts;
using CS.Contracts.GrpcClient.Contracts.Requests.Deposits;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using MediatR;

namespace CS.WebWallet.Business.Features.Deposits;

public class CloseClientDepositCommand(string id) : IRequest<Result>
{
    public string Id => id;
}

public class CloseClientDepositHandler(IContractsDepositsService depositService, ICurrentUserService currentUser)
    : IRequestHandler<CloseClientDepositCommand, Result>
{
    public async Task<Result> Handle(CloseClientDepositCommand request, CancellationToken token)
    {
        var response = await depositService.CloseClientDeposit(
            new CloseClientDepositRequest { Id = request.Id, ClientId = currentUser.GetClientId() }, token);

        return response;
    }
}