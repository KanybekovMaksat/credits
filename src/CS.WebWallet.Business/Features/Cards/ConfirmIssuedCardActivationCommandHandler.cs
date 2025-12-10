using CS.Banking.GrpcClient.Contracts;
using CS.Banking.GrpcClient.Contracts.Requests.Cards;
using CS.Sdk.Commons.Models;
using MediatR;

namespace CS.WebWallet.Business.Features.Cards;

public class ConfirmIssuedCardActivationCommand : IRequest<Result>
{
    public string Code { get; set; }
    public Guid Key { get; set; }
}

public class ConfirmIssuedCardActivationCommandHandler : IRequestHandler<ConfirmIssuedCardActivationCommand, Result>
{
    private readonly IBankCustomersService _bankService;

    public ConfirmIssuedCardActivationCommandHandler(IBankCustomersService bankService)
    {
        _bankService = bankService;
    }

    public async Task<Result> Handle(ConfirmIssuedCardActivationCommand request, CancellationToken cancellationToken)
    {
        return await _bankService.ConfirmCardStatusChange(
            new ConfirmCardStatusChangeRequest { Code = request.Code, RequestKey = request.Key, }, cancellationToken);
    }
}