using CS.Contracts.GrpcClient.Contracts;
using CS.Contracts.GrpcClient.Contracts.Requests.Deposits;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using MediatR;

namespace CS.WebWallet.Business.Features.Deposits;

public class AddDepositRequestCommand : IRequest<Result>
{
    public int ShowcaseItemId { get; set; }
    public string Comment { get; set; }
    public bool EulaAccepted { get; set; }
    public decimal Amount { get; set; }
    public string DepositProgramRowId { get; set; }
}

public class AddDepositRequestHandler(IContractsDepositsService depositsService, ICurrentUserService currentUser)
    : IRequestHandler<AddDepositRequestCommand, Result>
{
    public Task<Result> Handle(AddDepositRequestCommand request, CancellationToken token)
        => depositsService.AddDepositRequest(new AddDepositRequestRequest
        {
            ShowcaseItemId = request.ShowcaseItemId,
            ClientId = currentUser.GetClientId(),
            EulaAccepted = request.EulaAccepted,
            Amount = request.Amount,
            Comment = request.Comment,
            DepositProgramRowId = request.DepositProgramRowId,
            CreatedBy = $"user {currentUser.GetClientId()}",
        }, token).AsTask();
}