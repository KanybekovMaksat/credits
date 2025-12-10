using CS.Contracts.GrpcClient.Kyc.Contracts;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Extensions;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Kyc.v2;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using SetPhoneRequest = CS.Contracts.GrpcClient.Kyc.Contracts.ClientSide.Requests.SetPhoneRequest;

namespace CS.WebWallet.Business.Features.Kyc;

public class SetClientPhoneCommand : IRequest<Result<CodeDto>>
{
    public int StageId { get; set; }
    public string Phone { get; set; }
    public string CountryId { get; set; }
}

public class SetClientPhoneValidator : AbstractValidator<SetClientPhoneCommand>
{
    public SetClientPhoneValidator()
    {
        RuleFor(e => e.StageId).NotEmpty().WithMessage("KYC stage is not defined");
        RuleFor(e => e.Phone).NotEmpty().WithMessage("Phone should not be empty");
        RuleFor(e => e.CountryId).NotEmpty().WithMessage("Phone country should not be empty");
        RuleFor(e => e.Phone).Custom((e, context) =>
        {
            if (!string.IsNullOrWhiteSpace(e) && !e.IsPhoneValid(context.InstanceToValidate.CountryId))
                context.AddFailure(nameof(SetClientPhoneCommand.Phone),
                    "Invalid phone number! Make sure that you entered a valid phone.");
        });
    }
}

public class SetClientPhoneCommandHandler(
    IKycClientService kycService,
    ICurrentUserService userService,
    IWebHostEnvironment env)
    : IRequestHandler<SetClientPhoneCommand, Result<CodeDto>>
{
    public async Task<Result<CodeDto>> Handle(SetClientPhoneCommand request, CancellationToken cancellationToken)
    {
        var result = await kycService.SetPhone(
            new SetPhoneRequest
            {
                Phone = request.Phone, 
                ClientId = userService.GetClientId(), 
                StageId = request.StageId,
                CountryId = request.CountryId
            }, cancellationToken);

        return result.Success
            ? Result<CodeDto>.Ok(new CodeDto { Code = !env.IsProduction() ? result.Data : null })
            : Result<CodeDto>.Failed(result);
    }
}