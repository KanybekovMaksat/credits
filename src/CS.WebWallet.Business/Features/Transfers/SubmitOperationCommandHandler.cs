using CS.Identity.Client.Services;
using CS.Orchestrator.Contracts.Common.Models;
using CS.Orchestrator.GrpcClient;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Helpers;
using CS.WebWallet.Business.Models.Transfers;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;

namespace CS.WebWallet.Business.Features.Transfers;

public class SubmitOperationCommand : IRequest<Result<OperationSubmitResponse>>
{
    public SubmitRequest Submit { get; }

    public SubmitOperationCommand(SubmitRequest submit)
    {
        Submit = submit;
    }
}

public class SubmitOperationCommandHandler : IRequestHandler<SubmitOperationCommand, Result<OperationSubmitResponse>>
{
    private readonly IProcessingService _processing;
    private readonly ICurrentUserService _userService;
    private readonly IHttpContextAccessor _accessor;
    private readonly IWebHostEnvironment _environment;

    public SubmitOperationCommandHandler(
        IProcessingService processing,
        ICurrentUserService userService,
        IHttpContextAccessor accessor,
        IWebHostEnvironment environment)
    {
        _processing = processing;
        _userService = userService;
        _accessor = accessor;
        _environment = environment;
    }

    public async Task<Result<OperationSubmitResponse>> Handle(
        SubmitOperationCommand request, CancellationToken cancellationToken)
    {
        var user = _userService.GetCurrentUser();
        var result = await _processing.Submit(
            new CommonSubmitRequest
            {
                ClientId = user.ClientId,
                PartnerId = user.Provider,
                Confirmed = request.Submit.Confirmed,
                DocumentId = request.Submit.DocumentId,
                Otp = request.Submit.Otp,
                SecurityCode = request.Submit.SecurityCode,
                Meta = _accessor.GetMetadata(),
                CardId = request.Submit.CardId,
            }, cancellationToken);

        if (!result.Success)
            return Result<OperationSubmitResponse>.Failed(result);

        var response = result.Data.Adapt<OperationSubmitResponse>();
        if (response.Otp.Validated)
            response.Otp = null;

        if (response.RequiresConfirmation)
            response.Otp = new OtpDto { ResendAfter = 900, ValidFor = 900 };

        if (response.Otp is not null && !string.IsNullOrWhiteSpace(response.Otp?.Otp) && _environment.IsProduction())
            response.Otp.Otp = null;
        
        return Result<OperationSubmitResponse>.Ok(response);
    }
}