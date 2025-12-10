using CS.Identity.Client.Services;
using CS.Orchestrator.Contracts.Common.Models;
using CS.Orchestrator.GrpcClient;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Helpers;
using CS.WebWallet.Business.Models.Transfers;
using FluentValidation;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Http;
using RateDto = CS.WebWallet.Business.Models.Hubs.RateDto;

namespace CS.WebWallet.Business.Features.Transfers;

public class CommonTransferInfoQuery(OperationInfoRequest requisites)
    : IRequest<Result<OperationInfoResponse>>
{
    public OperationInfoRequest Requisites { get; } = requisites;
    public bool UseBonuses { get; set; }
}

public class CommonTransferInfoValidator : AbstractValidator<CommonTransferInfoQuery>
{
    public CommonTransferInfoValidator()
    {
        RuleFor(e => e.Requisites).Custom((obj, ctx) =>
        {
            if (obj is null)
            {
                ctx.AddFailure("Invalid request");
                return;
            }

            // if (obj.AccountFromId == default) ctx.AddFailure("Invalid source account");
            // if (obj.AccountToId == default) ctx.AddFailure("Invalid target account");
            if (obj.AmountFrom <= 0 && obj.AmountTo <= 0) ctx.AddFailure("Invalid operation amount");
        });
    }
}

public class CommonTransferInfoQueryHandler(
    IProcessingService processing,
    ICurrentUserService userService,
    IHttpContextAccessor accessor)
    : IRequestHandler<CommonTransferInfoQuery, Result<OperationInfoResponse>>
{
    public async Task<Result<OperationInfoResponse>> Handle(
        CommonTransferInfoQuery request, CancellationToken cancellationToken)
    {
        var user = userService.GetCurrentUser();
        var result = await processing.GetOperationInfo(
            new CommonOperationRequest
            {
                ClientId = user.ClientId,
                PartnerId = user.Provider,
                AmountFrom = request.Requisites.AmountFrom,
                AmountTo = request.Requisites.AmountTo,
                AccountFromId = request.Requisites.AccountFromId,
                AccountToId = request.Requisites.AccountToId,
                UseBonuses = request.UseBonuses,
                Meta = accessor.GetMetadata(),
                Respondent = request.Requisites.Respondent?.Adapt<RecipientRequisitesDto>(),
            }, cancellationToken);

        if (!result.Success)
            return Result<OperationInfoResponse>.Failed(result);

        var response = Result<OperationInfoResponse>.Ok(new OperationInfoResponse
        {
            Allowed = result.Data.Allowed,
            AmountFrom = result.Data.AmountFrom.FromGrpc(),
            AmountTo = result.Data.AmountTo.FromGrpc(),
            Fee = result.Data.Fee.FromGrpc(),
            DocumentId = result.Data.DocumentId,
            Rate = new RateDto(result.Data.Rate.Base, result.Data.Rate.Quoted, result.Data.Rate.Amount),
            BusinessOperationId = result.Data.BusinessOperationId
        }, result.Message);

        response.ErrorCode = result.ErrorCode;
        return response;
    }
}