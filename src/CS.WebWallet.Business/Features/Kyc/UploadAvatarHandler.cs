using CS.Contracts.GrpcClient.Kyc.Contracts;
using CS.Contracts.GrpcClient.Kyc.Contracts.ClientSide.Requests;
using CS.FileService.Abstractions;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Services;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CS.WebWallet.Business.Features.Kyc;

public class UploadAvatarCommand : IRequest<Result>
{
    public IFormFile Avatar { get; set; }
}

public class UploadAvatarHandler(
    ICurrentUserService userService,
    IImageProcessor imageProcessor,
    IFileService fileService,
    IKycClientService kycClientService
) : IRequestHandler<UploadAvatarCommand, Result>
{
    public async Task<Result> Handle(UploadAvatarCommand request, CancellationToken cancellationToken)
    {
        var clientId = userService.GetClientId();
        await using var avatar = request.Avatar.OpenReadStream();
        await using var data = await imageProcessor.ScaleImage(avatar, 240, 320, cancellationToken);

        var avatarRef = await fileService.SaveFile(
            data, request.Avatar.FileName, request.Avatar.ContentType, clientId);

        return await kycClientService.SetAvatar(
            new SetAvatarRequest { ClientId = clientId, AvatarUrl = avatarRef }, cancellationToken);
    }
}