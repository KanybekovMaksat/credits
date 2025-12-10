using CS.Identity.Client.Services;
using CS.Ledger.Client.MobileApi;
using CS.Ledger.Client.MobileApi.Contracts.Documents.Requests;
using CS.Ledger.Contracts.Commons.Enums.Client;
using CS.Sdk.Commons.Models;
using CS.Sdk.Commons.Models.PagedRequest;
using CS.WebWallet.Business.Models.History;
using Mapster;
using MediatR;

namespace CS.WebWallet.Business.Features.History;

public class GetHistoryQuery(PageContext<HistoryPageFilter> context) : IRequest<PagedResult<HistoryRecordDto>>
{
    public PageContext<HistoryPageFilter> Context { get; } = context;
}

public class GetHistoryQueryHandler(
    IMobileApiService mobileApiService,
    ICurrentUserService currentUserService)
    : IRequestHandler<GetHistoryQuery, PagedResult<HistoryRecordDto>>
{
    public async Task<PagedResult<HistoryRecordDto>> Handle(
        GetHistoryQuery request,
        CancellationToken token)
    {
        var accountId = request.Context.Filter?.AccountId;
        var clientId = currentUserService.GetClientId();
        var response = await mobileApiService.GetHistory(new GetHistoryRequest
        {
            Count = request.Context.PageSize,
            Page = request.Context.PageIndex,
            AccountId = accountId,
            OwnerId = clientId,
            Type = (HistoryType?)request.Context.Filter?.OperationType
        }, token);

        if (!response.Success)
            return PagedResult<HistoryRecordDto>.Failed(response);

        if (response.Data is null)
            return PagedResult<HistoryRecordDto>.Ok(ArraySegment<HistoryRecordDto>.Empty);

        var data = response.Data.Select(item => item.Adapt<HistoryRecordDto>()).ToList();

        return PagedResult<HistoryRecordDto>.Ok(data, response.Count, response.Page, response.Total);
    }
}