using System.Net.Mail;
using CS.Contracts.GrpcClient.Kyc.Contracts;
using CS.Contracts.GrpcClient.Kyc.Contracts.ClientSide.Requests;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Kyc.v2;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace CS.WebWallet.Business.Features.Kyc;

public class SetClientEmailCommand : IRequest<Result<CodeDto>>
{
    public int StageId { get; set; }
    public string Email { get; set; }
}

public class SetClientEmailValidator : AbstractValidator<SetClientEmailCommand>
{
    public SetClientEmailValidator()
    {
        RuleFor(e => e.StageId).NotEmpty().WithMessage("KYC stage is not defined");
        RuleFor(e => e.Email).Custom((e, ctx) =>
        {
            if (string.IsNullOrWhiteSpace(e))
                ctx.AddFailure("Email cannot be empty");

            if (!MailAddress.TryCreate(e ?? string.Empty, out _))
                ctx.AddFailure("Email has invalid format");
        });
    }
}

public class SetClientEmailCommandHandler(
    IKycClientService kycService,
    ICurrentUserService userService,
    IWebHostEnvironment env)
    : IRequestHandler<SetClientEmailCommand, Result<CodeDto>>
{
    public async Task<Result<CodeDto>> Handle(SetClientEmailCommand request, CancellationToken cancellationToken)
    {
        var result = await kycService.SetMail(
            new SetMailRequest
            {
                Email = request.Email,
                ClientId = userService.GetClientId(),
                StageId = request.StageId
            }, cancellationToken);

        return result.Success
            ? Result<CodeDto>.Ok(new CodeDto { Code = !env.IsProduction() ? result.Data : null })
            : Result<CodeDto>.Failed(result);
    }
}