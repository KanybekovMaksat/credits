using CS.Contracts.GrpcClient.Contracts;
using CS.Contracts.GrpcClient.Contracts.Models.ContractRequests;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Showcases;
using Mapster;
using MediatR;

namespace CS.WebWallet.Business.Features.Showcases;

public class AddContractRequestCommand : IRequest<Result<RequestActionsDto>>
{
    public int ShowcaseItemId { get; set; }
    public bool EulaAccepted { get; set; }
}

public class AddContractRequestCommandHandler : IRequestHandler<AddContractRequestCommand, Result<RequestActionsDto>>
{
    private readonly IContractRequestsService _service;
    private readonly ICurrentUserService _currentUser;

    public AddContractRequestCommandHandler(IContractRequestsService service, ICurrentUserService currentUser)
    {
        _service = service;
        _currentUser = currentUser;
    }

    public async Task<Result<RequestActionsDto>> Handle(
        AddContractRequestCommand request, CancellationToken cancellationToken)
    {
        var clintId = _currentUser.GetClientId();
        var command = new AddContractRequestRequest
        {
            ClientId = clintId,
            CreatedBy = $"client {clintId}",
            ShowcaseItemId = request.ShowcaseItemId,
            EulaAccepted = request.EulaAccepted
        };

        var response = await _service.AddContractRequest(command, cancellationToken);

        return response.Success
            ? Result<RequestActionsDto>.Ok(response.Data.Adapt<RequestActionsDto>())
            : Result<RequestActionsDto>.Failed(response);
    }
}