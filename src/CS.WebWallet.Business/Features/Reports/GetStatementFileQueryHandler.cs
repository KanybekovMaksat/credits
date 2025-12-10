using CS.Contracts.GrpcClient.Contracts;
using CS.Contracts.GrpcClient.Contracts.Models.Clients.GetClients;
using CS.Contracts.GrpcClient.Contracts.Models.Clients.Partners.GetRootPartner;
using CS.Contracts.GrpcClient.Contracts.Models.Dto.Basic;
using CS.FileService.Abstractions;
using CS.Identity.Client.Services;
using CS.Ledger.Client.MobileApi;
using CS.Ledger.Client.MobileApi.Contracts.Documents.Requests;
using CS.Ledger.Client.MobileApi.Contracts.Documents.Responses.AccountStatement;
using CS.Receipts.Abstractions.Models;
using CS.Receipts.Client.AccountStatement;
using CS.Receipts.Client.Models;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Helpers;
using CS.WebWallet.Business.Models.Reports;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using QuestPDF.Fluent;

namespace CS.WebWallet.Business.Features.Reports;

public class GetStatementFileQuery : IRequest<Result<FileResponse>>
{
    public Guid AccountId { get; set; }
    public DateTime From { get; set; }
    public DateTime To { get; set; }
}

public class GetStatementFileValidator : AbstractValidator<GetStatementFileQuery>
{
    public GetStatementFileValidator()
    {
        RuleFor(e => e.From).Must((ctx, e) => ctx.To >= e).WithMessage("`From` date should be less or equal `To` date");
        RuleFor(e => e.AccountId).NotEmpty().WithMessage("Please select exact account");
    }
}

public class GetStatementFileQueryHandler : IRequestHandler<GetStatementFileQuery, Result<FileResponse>>
{
    private readonly IMobileApiService _ledgerService;
    private readonly IClientsService _clientsService;
    private readonly ICurrentUserService _userService;
    private readonly IFileService _fileService;
    private readonly ILogger<GetStatementFileQueryHandler> _logger;

    public GetStatementFileQueryHandler(
        IMobileApiService ledgerService,
        IClientsService clientsService,
        ICurrentUserService userService,
        IFileService fileService,
        ILogger<GetStatementFileQueryHandler> logger)
    {
        _ledgerService = ledgerService;
        _clientsService = clientsService;
        _userService = userService;
        _fileService = fileService;
        _logger = logger;
    }

    public async Task<Result<FileResponse>> Handle(GetStatementFileQuery request, CancellationToken token)
    {
        var clientId = _userService.GetClientId();
        var partnerId = _userService.GetProvider();
        var data = await _ledgerService.GetStatementReport(
            new GetStatementReportRequest
            {
                From = request.From.Date,
                To = request.To.Date <= request.From.Date ? request.From.Date.AddDays(1) : request.To.Date,
                AccountId = request.AccountId,
                OwnerId = clientId
            }, token);

        if (!data.Success)
        {
            _logger.LogWarning("Could not get statement data: {Message}", data.Message);
            return Result<FileResponse>.Failed(data);
        }

        var partner = await _clientsService.GetRootPartner(new GetRootPartnerRequest { PartnerId = partnerId }, token);
        if (!partner.Success)
        {
            _logger.LogWarning("Could not get root partner data with {PartnerId}: {Message}", partnerId,
                data.Message);
            return Result<FileResponse>.Failed(partner);
        }

        var clientData = await _clientsService.GetClient(new GetClientRequest { ClientId = clientId }, token);
        if (!clientData.Success)
        {
            _logger.LogWarning("Could not get client {ClientId} data: {Message}", clientId, clientData.Message);
            return Result<FileResponse>.Failed(clientData);
        }

        using var logoStream = new MemoryStream();


        byte[] logo = null;
        if (!string.IsNullOrWhiteSpace(partner.Data.LogoLarge))
        {
            try
            {
                var logoFile = await _fileService.GetFile(partner.Data.LogoLarge, logoStream);
                logo = (logoFile?.Data as MemoryStream)?.ToArray();
            }
            catch (Exception e)
            {
                _logger.LogWarning(e, "Cannot get partner's logo");
            }
        }

        var metadata = GetData(data.Data, partner.Data, clientData.Data, logo);
        metadata.From = request.From;
        metadata.To = request.To;

        var statement = new AccountStatementGenerator()
            .GetMetadata(
                metadata,
                new BaseDocumentMetadata("Account statement",
                    $"Id:{request.AccountId} From:{request.From} To:{request.To}"))
            .Compose();

        var file = statement.GeneratePdf();

        return Result<FileResponse>.Ok(new FileResponse
        {
            Name = $"account_statement.{DateTime.UtcNow.ToString("yyyyMMdd_hhmmss")}.pdf",
            MimeType = "application/pdf",
            Blob = file
        });
    }

    private static AccountStatementData GetData(
        StatementReportResponse data,
        PartnerDto partner,
        ClientResponse client,
        byte[] partnerLogo)
    {
        var accNameParts = data.AccountNumber.Split('-');
        var overall = data.Transactions.Sum(e => e.Credit - e.Debit);
        return new AccountStatementData
        {
            Partner = new PartnerData
            {
                Address1 = partner.AddressLine1,
                Address2 = partner.AddressLine2,
                Name = partner.Name,
                Logo = partnerLogo,
            },
            Client = new ClientMeta
            {
                Address = string.Join(',', new[]
                {
                    client.CountryId,
                    client.State,
                    client.City,
                    client.Street,
                    client.Building,
                    client.BuildingNumber,
                    client.Flat
                }.Where(e => !string.IsNullOrEmpty(e))),
                Email = client.Email,
                Name = client.Name
            },
            Account = new AccountMeta
            {
                Number = accNameParts.Length == 1 ? accNameParts[0] : string.Join("-", accNameParts[^2..]),
                CurrencyCode = data.Currency.Code,
                CurrencyName = data.Currency.Name
            },
            Close = ValueData.New(data.OpeningBalance + overall, data.Currency.Fraction),
            Open = ValueData.New(data.OpeningBalance, data.Currency.Fraction),
            Transactions = data.Transactions.OrderBy(e => e.Date).Select((e, i) => new TransactionMeta
            {
                Credit = ValueData.New(e.Credit, data.Currency.Fraction),
                Date = e.Date,
                Debit = ValueData.New(-e.Debit, data.Currency.Fraction),
                Details = e.Type.GetReceiptOperationType(),
                Order = i + 1,
            }).ToList()
        };
    }
}