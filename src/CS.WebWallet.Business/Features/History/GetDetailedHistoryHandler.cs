using CS.Identity.Client.Services;
using CS.Ledger.Client.MobileApi;
using CS.Ledger.Client.MobileApi.Contracts.Documents.Requests;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.History;
using Mapster;
using MediatR;

namespace CS.WebWallet.Business.Features.History;

public class GetDetailedHistoryQuery(Guid entryId, Guid? accountId) : IRequest<Result<HistoryRecordDto>>
{
    public Guid EntryId { get; } = entryId;
    public Guid? AccountId { get; } = accountId;
}

public class GetDetailedHistoryHandler(IMobileApiService mobileApiService, ICurrentUserService userService)
    : IRequestHandler<GetDetailedHistoryQuery, Result<HistoryRecordDto>>
{
    public async Task<Result<HistoryRecordDto>> Handle(
        GetDetailedHistoryQuery request,
        CancellationToken token)
    {
        var clientId = userService.GetClientId();
        var response = await mobileApiService.GetHistoryDetails(new GetHistoryDetailsRequest
            { DocumentId = request.EntryId, AccountId = request.AccountId, OwnerId = clientId }, token);

        if (!response.Success)
            return Result<HistoryRecordDto>.Failed(response);

        return response.Data == null
            ? Result<HistoryRecordDto>.NotFound("Transaction not found")
            : Result<HistoryRecordDto>.Ok(response.Data.Adapt<HistoryRecordDto>());
    }
}