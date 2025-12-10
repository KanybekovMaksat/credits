using CS.Orchestrator.GrpcClient;
using CS.Orchestrator.GrpcClient.Banking.Requests;
using CS.Sdk.Commons.Models;
using MediatR;

namespace CS.WebWallet.Business.Features.Cards;

public class DeleteIssuedCardCommand : IRequest<Result>
{
    public string CardId { get; }

    public DeleteIssuedCardCommand(string cardId)
    {
        CardId = cardId;
    }
}

public class DeleteIssuedCardCommandHandler : IRequestHandler<DeleteIssuedCardCommand, Result>
{
    private readonly IOrchestratorBankingService _bankingService;

    public DeleteIssuedCardCommandHandler(IOrchestratorBankingService bankingService)
    {
        _bankingService = bankingService;
    }

    public async Task<Result> Handle(DeleteIssuedCardCommand request, CancellationToken cancellationToken)
        => await _bankingService.CloseBankCard(new CloseBankCardRequest { CardId = request.CardId }, cancellationToken);
}