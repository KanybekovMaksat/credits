using CS.Identity.Client.Services;
using CS.Orchestrator.GrpcClient;
using CS.Orchestrator.GrpcClient.Processing.Requests;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Transfers;
using Mapster;
using MediatR;

namespace CS.WebWallet.Business.Features.Transfers;

public record ResendOtp(Guid DocumentId) : IRequest<Result<OtpDto>>;

public class ResendOtpHandler(IProcessingService processing, ICurrentUserService userService)
    : IRequestHandler<ResendOtp, Result<OtpDto>>
{
    public async Task<Result<OtpDto>> Handle(ResendOtp request, CancellationToken cancellationToken)
    {
        var result = await processing.ResendOperationOtp(
            new ResendOperationOtpRequest { DocumentId = request.DocumentId, ClientId = userService.GetClientId() },
            cancellationToken);

        return result.Success ? Result<OtpDto>.Ok(result.Data.Adapt<OtpDto>()) : Result<OtpDto>.Failed(result);
    }
}