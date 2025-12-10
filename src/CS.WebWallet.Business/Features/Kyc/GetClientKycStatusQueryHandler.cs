using CS.Contracts.GrpcClient.Kyc.Contracts;
using CS.Contracts.GrpcClient.Kyc.Contracts.Shared;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Kyc.v2;
using Mapster;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CS.WebWallet.Business.Features.Kyc;

public class GetClientKycStatusQuery : IRequest<Result<KycStatusDto>>
{
}

public class GetClientKycStatusQueryHandler(
    ICurrentUserService userService,
    IKycClientService kycService,
    ILogger<GetClientKycStatusQueryHandler> logger)
    : IRequestHandler<GetClientKycStatusQuery, Result<KycStatusDto>>
{
    public async Task<Result<KycStatusDto>> Handle(GetClientKycStatusQuery request, CancellationToken cancellationToken)
    {
        var result = await kycService.GetStatus(
            new ClientIdRequest { ClientId = userService.GetClientId() }, cancellationToken);
        
        if (result.Success)
            return Result<KycStatusDto>.Ok(result.Data.Adapt<KycStatusDto>());
        
        logger.LogWarning("Could not get client KYC status: {Message}", result.Message);
        return Result<KycStatusDto>.Failed(result);
    }
}