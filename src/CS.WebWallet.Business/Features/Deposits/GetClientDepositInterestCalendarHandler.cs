using CS.Contracts.GrpcClient.Contracts;
using CS.Contracts.GrpcClient.Contracts.Requests.Deposits;
using CS.Ledger.Stores;
using CS.Sdk.Commons.Extensions;
using CS.Sdk.Commons.Models;
using CS.Sdk.Commons.Models.PagedRequest;
using MediatR;

namespace CS.WebWallet.Business.Features.Deposits;

public class GetClientDepositInterestCalendarQuery(PageContext<InterestCalendarPageFilter> context)
    : IRequest<PagedResult<InterestCalendarRowDto>>
{
    public PageContext<InterestCalendarPageFilter> Context { get; } = context;
    public string ClientDepositId { get; set; }
}

public class InterestCalendarPageFilter;

public class GetClientDepositInterestCalendarHandler(IContractsDepositsService depositsService, ICurrenciesStore store)
    : IRequestHandler<GetClientDepositInterestCalendarQuery, PagedResult<InterestCalendarRowDto>>
{
    public async Task<PagedResult<InterestCalendarRowDto>> Handle(
        GetClientDepositInterestCalendarQuery request,
        CancellationToken token)
    {
        var response = await depositsService.GetClientDepositInterestRows(
            new GetClientDepositInterestRowsRequest
            {
                ClientDepositId = request.ClientDepositId,
                Count = request.Context.PageSize,
                Page = request.Context.PageIndex,
            }, token);

        if (!response.Success || response.Data is null || !response.Data.Any())
            return PagedResult<InterestCalendarRowDto>.Ok([], request.Context.PageSize, request.Context.PageIndex);

        var currency = await store.GetById(response.Data.First().CurrencyId);
        var result = response.Data.Select(a => new InterestCalendarRowDto
        {
            Id = a.Id,
            ClientDepositId = a.ClientDepositId,
            Created = a.Created,
            Date = a.Date,
            DocumentId = a.DocumentId,
            HasBeenPaid = a.HasBeenPaid,
            Amount = new ValueDto(a.Amount, a.Amount.Format(currency.Fraction), currency.Code),
        });

        return PagedResult<InterestCalendarRowDto>.Ok(result, response.Count, response.Page, response.Total);
    }
}

public class InterestCalendarRowDto
{
    public string Id { get; set; }
    public ValueDto Amount { get; set; }
    public DateTime Date { get; set; }
    public bool HasBeenPaid { get; set; }
    public Guid? DocumentId { get; set; }
    public DateTime Created { get; set; }
    public string ClientDepositId { get; set; }
}