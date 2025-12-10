using CS.Contracts.GrpcClient.Kyc.Contracts;
using CS.Contracts.GrpcClient.Kyc.Contracts.Shared;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Kyc.v2;
using Mapster;
using MediatR;

namespace CS.WebWallet.Business.Features.Kyc;

public class GetClientPersonalQuery : IRequest<Result<KycPersonalInfoDto>>
{
}

public class GetClientPersonalQueryHandler(
    ICurrentUserService userService,
    IKycClientService kycClientService)
    : IRequestHandler<GetClientPersonalQuery, Result<KycPersonalInfoDto>>
{
    public async Task<Result<KycPersonalInfoDto>> Handle(
        GetClientPersonalQuery request, CancellationToken cancellationToken)
    {
        var result = await kycClientService.GetPersonal(
            new ClientIdRequest { ClientId = userService.GetClientId() }, cancellationToken);

        return result.Success
            ? Result<KycPersonalInfoDto>.Ok(result.Data.Adapt<KycPersonalInfoDto>())
            : Result<KycPersonalInfoDto>.Failed(result);
    }
}