using CS.Contracts.GrpcClient.Contracts;
using CS.Contracts.GrpcClient.Contracts.Models.AccountRequisites.GetAccountRequisiteContent;
using CS.Ledger.Client.MobileApi;
using CS.Ledger.Client.MobileApi.Contracts.Accounts;
using CS.Ledger.Client.MobileApi.Contracts.Accounts.Requests;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Payments;
using FluentValidation;
using Mapster;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CS.WebWallet.Business.Features.Transfers;

public class GetPaymentRequisitesQuery : IRequest<Result<PaymentRequisitesCheckDto>>
{
    public Guid AccountId { get; set; }
}

public class GetPaymentRequisitesQueryValidator : AbstractValidator<GetPaymentRequisitesQuery>
{
    public GetPaymentRequisitesQueryValidator()
    {
        RuleFor(x => x.AccountId).NotEmpty();
        RuleFor(x => x.AccountId).NotEqual(default(Guid));
    }
}

public class GetPaymentRequisitesQueryHandler : IRequestHandler<GetPaymentRequisitesQuery,
    Result<PaymentRequisitesCheckDto>>
{
    private readonly ILogger<GetPaymentRequisitesQueryHandler> _logger;
    private readonly IAccountTemplatesService _service;
    private readonly IMobileApiService _mobileApiService;

    public GetPaymentRequisitesQueryHandler(
        IAccountTemplatesService service,
        IMobileApiService mobileApiService,
        ILogger<GetPaymentRequisitesQueryHandler> logger)
    {
        _service = service;
        _logger = logger;
        _mobileApiService = mobileApiService;
    }

    public async Task<Result<PaymentRequisitesCheckDto>> Handle(
        GetPaymentRequisitesQuery request,
        CancellationToken cancellationToken)
    {
        var response = await _service.GetAccountRequisiteContent(
            request.Adapt<GetAccountRequisiteContentRequest>(), cancellationToken);

        if (!response.Success)
        {
            _logger.LogWarning(response.Message);
            return Result<PaymentRequisitesCheckDto>.Failed(response);
        }

        var result = response.Data?.Adapt<PaymentRequisitesCheckDto>();

        if (result is null)
            return Result<PaymentRequisitesCheckDto>.NotFound("Can't found requisites for account.");

        var accountDetailsResponse = await _mobileApiService.GetAccountDetails(
            new GetAccountDetailsRequest() { Id = request.AccountId }, cancellationToken);

        ReplaceExternalId(result, accountDetailsResponse.Data?.ExternalId);

        return Result<PaymentRequisitesCheckDto>.Ok(result);
    }

    private static void ReplaceExternalId(PaymentRequisitesCheckDto model, string externalId)
    {
        model.Info = model.Info?.Replace("{ExternalId}", externalId);
        model.Recipient = model.Recipient?.Replace("{ExternalId}", externalId);
        model.PaymentPurpose = model.PaymentPurpose?.Replace("{ExternalId}", externalId);
        model.IBAN = model.IBAN?.Replace("{ExternalId}", externalId);
    }
}