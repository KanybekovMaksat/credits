using CS.Contracts.GrpcClient.Kyc.Contracts;
using CS.Contracts.GrpcClient.Kyc.Contracts.ClientSide.Requests;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using FluentValidation;
using MediatR;

namespace CS.WebWallet.Business.Features.Kyc;

public class ConfirmWithCodeCommand : IRequest<Result>
{
    public int StageId { get; set; }
    public string Code { get; set; }
}

public class ConfirmWithCodeValidator : AbstractValidator<ConfirmWithCodeCommand>
{
    public ConfirmWithCodeValidator()
    {
        RuleFor(e => e.StageId).GreaterThan(0).WithMessage("Invalid KYC stage");
        RuleFor(e => e.Code).NotEmpty().WithMessage("Confirmation code cannot be empty");
    }
}

public class ConfirmWithCodeCommandHandler(
    IKycClientService kycService,
    ICurrentUserService userService)
    : IRequestHandler<ConfirmWithCodeCommand, Result>
{
    public async Task<Result> Handle(ConfirmWithCodeCommand request, CancellationToken cancellationToken)
    {
        return await kycService.ConfirmStageWithCode(
            new ConfirmStageWithCodeRequest
            {
                Code = request.Code,
                ClientId = userService.GetClientId(),
                StageId = request.StageId
            }, cancellationToken);
    }
}