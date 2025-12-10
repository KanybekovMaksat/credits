using CS.Contracts.GrpcClient.Kyc.Contracts;
using CS.Contracts.GrpcClient.Kyc.Contracts.ClientSide.Requests;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Kyc.v2;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace CS.WebWallet.Business.Features.Kyc;

public class ResendCodeCommand : IRequest<Result<CodeDto>>
{
    public int StageId { get; set; }
}

public class ResendCodeCommandHandler(
    IKycClientService kycService,
    ICurrentUserService userService,
    IWebHostEnvironment env)
    : IRequestHandler<ResendCodeCommand, Result<CodeDto>>
{
    public async Task<Result<CodeDto>> Handle(ResendCodeCommand request, CancellationToken cancellationToken)
    {
        var result = await kycService.ResendStageCode(
            new ResendKycCodeRequest { ClientId = userService.GetClientId(), StageId = request.StageId },
            cancellationToken);

        return result.Success
            ? Result<CodeDto>.Ok(new CodeDto { Code = !env.IsProduction() ? result.Data : null })
            : Result<CodeDto>.Failed(result);
    }
}