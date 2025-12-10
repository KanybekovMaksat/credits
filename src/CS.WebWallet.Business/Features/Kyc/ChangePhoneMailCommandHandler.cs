using CS.Contracts.Contracts.Commons.Enums;
using CS.Contracts.GrpcClient.Kyc.Contracts;
using CS.Contracts.GrpcClient.Kyc.Contracts.ClientSide.Requests;
using CS.Contracts.GrpcClient.Kyc.Contracts.Shared;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Extensions;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Commons;
using CS.WebWallet.Business.Models.Kyc;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace CS.WebWallet.Business.Features.Kyc;

public class ChangePhoneMailCommand : IRequest<Result<ChangePhoneMailDto>>
{
    public ChangeStep Step { get; set; }
    public ChangeType Type { get; set; }
    public string NewValue { get; set; }
    public string Code { get; set; }
    public string CountryId { get; set; }
    public RequestMetadataDto Metadata { get; set; }
}

public class ChangePhoneMailValidator : AbstractValidator<ChangePhoneMailCommand>
{
    public ChangePhoneMailValidator()
    {
        RuleFor(e => e.CountryId).NotEmpty().When(e => e.Step == ChangeStep.StepOne && e.Type == ChangeType.Phone)
            .WithMessage("Please select you country - it's required when changing phone number");

        RuleFor(e => e.NewValue).NotEmpty().When(e => e.Step == ChangeStep.StepOne)
            .WithMessage(e => $"Please provide new {(e.Type == ChangeType.Mail ? "E-mail" : "phone number")}");
        
        RuleFor(e => e.NewValue).Custom((e, context) =>
        {
            if (!e.IsPhoneValid(context.InstanceToValidate.CountryId))
                context.AddFailure(
                    nameof(ChangePhoneMailCommand.NewValue), 
                    "Invalid phone number! Make sure that you entered a valid phone.");
        }).When(e => e.Type == ChangeType.Phone && e.Step == ChangeStep.StepOne);
        
        RuleFor(e => e.Code).NotEmpty().When(e => e.Step != ChangeStep.StepOne)
            .WithMessage("Confirmation code should be provided");
        
        RuleFor(e => e.NewValue).NotEmpty().When(e => e.Step == ChangeStep.StepOne)
            .WithMessage(e => $"New {(e.Type == ChangeType.Mail ? "E-mail" : "phone")} should be provided");
    }
}

public class ChangePhoneMailCommandHandler(
    IKycClientService kycService,
    ICurrentUserService userService,
    IWebHostEnvironment environment,
    ILogger<ChangePhoneMailCommandHandler> logger)
    : IRequestHandler<ChangePhoneMailCommand, Result<ChangePhoneMailDto>>
{
    private const string DefaultDevice = "Browser";

    public async Task<Result<ChangePhoneMailDto>> Handle(
        ChangePhoneMailCommand request,
        CancellationToken cancellationToken)
    {
        var clientId = userService.GetClientId();
        var (step, error) = DetermineStep(request.Step);
        if (error)
            return Result<ChangePhoneMailDto>.Bad("Invalid change step");

        var (type, typeError) = DetermineChange(request.Type);
        if (typeError)
            return Result<ChangePhoneMailDto>.Bad("Invalid change type");

        var result = await kycService.PhoneEmailChangeRequest(new ChangePhoneMailRequest
        {
            Code = request.Code,
            ClientId = clientId,
            NewValue = request.NewValue,
            OldValue = await GetOldValue(clientId, request.Type, cancellationToken),
            CountryId = request.CountryId,
            Step = step,
            Type = type,
            Metadata = new PhoneMailChangeMetadata
            {
                IpAddress = request.Metadata.IpAddress,
                UserAgent = request.Metadata.UserAgent,
                Device = DefaultDevice
            }
        }, cancellationToken);

        if (result.Success)
            return Result<ChangePhoneMailDto>.Ok(new ChangePhoneMailDto
            {
                Code = !environment.IsProduction() ? result.Data : null
            });

        logger.LogWarning("Could not perform {Type} change of {Step} for {ClientId}",
            request.Type, request.Step, clientId);
        return Result<ChangePhoneMailDto>.Failed(result);
    }

    private async Task<string> GetOldValue(int clientId, ChangeType type, CancellationToken cancellationToken)
    {
        var client = await kycService.GetPersonal(
            new ClientIdRequest { ClientId = clientId }, cancellationToken);
        if (client.Success)
            return type == ChangeType.Mail ? client.Data.Mail : client.Data.Phone;

        return string.Empty;
    }

    private static (KycChangeStep step, bool error) DetermineStep(ChangeStep requestStep)
    {
        return requestStep switch
        {
            ChangeStep.StepOne => (KycChangeStep.One, false),
            ChangeStep.StepTwo => (KycChangeStep.Two, false),
            ChangeStep.StepThree => (KycChangeStep.Three, false),
            _ => (KycChangeStep.One, true)
        };
    }

    private static (ConfirmationCodeType type, bool error) DetermineChange(ChangeType changeType)
    {
        return changeType switch
        {
            ChangeType.Mail => (ConfirmationCodeType.Mail, false),
            ChangeType.Phone => (ConfirmationCodeType.Phone, false),
            _ => (ConfirmationCodeType.Mail, true)
        };
    }
}