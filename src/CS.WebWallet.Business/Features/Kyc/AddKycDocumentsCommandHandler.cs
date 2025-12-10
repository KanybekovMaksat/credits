using CS.Contracts.Contracts.Commons.Enums.Kyc;
using CS.Contracts.GrpcClient.Kyc.Contracts;
using CS.Contracts.GrpcClient.Kyc.Contracts.ClientSide.Requests;
using CS.Contracts.GrpcClient.Kyc.Contracts.Shared;
using CS.FileService.Abstractions;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Services;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace CS.WebWallet.Business.Features.Kyc;

public class AddKycDocumentsCommand : IRequest<Result>
{
    public int StageId { get; set; }
    public IFormFile Front { get; set; }
    public IFormFile Back { get; set; }
    public KycDocumentType DocumentType { get; set; }
}

public class AddKycDocumentsValidator : AbstractValidator<AddKycDocumentsCommand>
{
    public AddKycDocumentsValidator()
    {
        RuleFor(e => e.StageId).NotEmpty().WithMessage("KYC stage is not defined");
        RuleFor(e => e.Front).NotNull().WithMessage("From image should be specified");
        RuleFor(e => (int)e.DocumentType).GreaterThan(0).WithMessage("Invalid document");
    }
}

public class AddKycDocumentsCommandHandler(
    IKycClientService kycService,
    ICurrentUserService userService,
    IImageProcessor imageProcessor,
    IFileService fileService,
    ILogger<AddKycDocumentsCommandHandler> logger)
    : IRequestHandler<AddKycDocumentsCommand, Result>
{
    public async Task<Result> Handle(AddKycDocumentsCommand request, CancellationToken cancellationToken)
    {
        var clientId = userService.GetClientId();
        var status = await kycService.GetStatus(new ClientIdRequest { ClientId = clientId }, cancellationToken);
        if (!status.Success)
            return Result.Failed("Could not get KYC status");

        var stage = status.Data.Stages?.FirstOrDefault(e => e.Id == request.StageId);
        if (stage is null)
            return Result.Bad("This KYC stage is not required");
        if (stage.Status == KycStageStatus.Approved)
            return Result.Bad("This KYC stage is already approved");

        var apiRequest = await UploadAndPrepareRequest(clientId, request, cancellationToken);
        if (apiRequest is null)
            return Result.Bad("Invalid request");

        var result = await kycService.AddDocuments(apiRequest, cancellationToken);

        if (!result.Success)
            logger.LogError("Could not save KYC documents: {Message}", result.Message);

        return result;
    }

    private async Task<AddDocumentsRequest> UploadAndPrepareRequest(
        int clientId,
        AddKycDocumentsCommand request,
        CancellationToken token)
    {
        var result = new AddDocumentsRequest
        {
            Type = request.DocumentType,
            ClientId = clientId,
            StageId = request.StageId,
            Front = await ProcessFile(clientId, request.Front, request.DocumentType, token),
            Back = await ProcessFile(clientId, request.Back, request.DocumentType, token),
        };

        return result.Front == null ? null : result;
    }

    private async Task<string> ProcessFile(int clientId, IFormFile file, KycDocumentType type, CancellationToken token)
    {
        if (file is null)
            return null;
        var isPdf = file.ContentType == "application/pdf";
        if (isPdf && type != KycDocumentType.ProofOfAddress)
        {
            logger.LogWarning("Only Proof of address may be a PDF-file");
            return null;
        }

        await using var fileStream = file.OpenReadStream();
        var fileRef = await fileService.SaveFile(
            isPdf ? fileStream : await imageProcessor.ScaleImage(fileStream, token: token),
            file.FileName,
            file.ContentType,
            clientId);

        return fileRef;
    }
}