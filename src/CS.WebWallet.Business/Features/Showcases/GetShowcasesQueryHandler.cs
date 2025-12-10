using CS.Contracts.Contracts.Commons.Enums;
using CS.Contracts.GrpcClient.Contracts;
using CS.Contracts.GrpcClient.Contracts.Models.Showcases.GetShowcaseData;
using CS.Identity.Client.Services;
using CS.References.Contracts.Common.Enums;
using CS.References.GrpcClient.Contracts;
using CS.References.GrpcClient.Models.DisplayableMessages.Requests;
using CS.References.GrpcClient.Models.DisplayableMessages.Responses;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Showcases;
using Mapster;
using MediatR;

namespace CS.WebWallet.Business.Features.Showcases;

public class GetShowcasesQuery : IRequest<ResultList<ShowcaseItemPlainDto>>
{
    public int ShowcaseType { get; set; }
    public string Iso6391 { get; set; }
}

public class GetShowcasesQueryHandler : IRequestHandler<GetShowcasesQuery, ResultList<ShowcaseItemPlainDto>>
{
    private readonly IShowcasesService _showcases;
    private readonly IDisplayableMessagesService _messages;
    private readonly ICurrentUserService _currentUser;

    public GetShowcasesQueryHandler(
        IShowcasesService showcases,
        IDisplayableMessagesService messages,
        ICurrentUserService currentUser)
    {
        _showcases = showcases;
        _messages = messages;
        _currentUser = currentUser;
    }

    public async Task<ResultList<ShowcaseItemPlainDto>> Handle(
        GetShowcasesQuery request, CancellationToken cancellationToken)
    {
        var showcases = await _showcases.GetShowcaseData(new GetShowcaseDataRequest
        {
            ApplicationType = (int)ApplicationType.Mobile,
            ClientId = _currentUser.GetClientId(),
        }, cancellationToken);

        if (!showcases.Success)
            return ResultList<ShowcaseItemPlainDto>.Failed(showcases);

        var result = new List<ShowcaseItemPlainDto>();

        if (showcases.Data is null)
            return ResultList<ShowcaseItemPlainDto>.Ok(result);

        var messageIds = showcases.Data.Where(s => s.Items is { Count: > 0 })
            .SelectMany(e => e.Items.Select(i => i.DisplayableMessageId))
            .ToList();

        var contents = (await _messages.GetContentForMessages(
                new GetContentForMessagesRequest { Ids = messageIds, Iso6391 = request.Iso6391.ToUpper() }, cancellationToken))
            .Data?.ToDictionary(e => e.DisplayableMessageId) ?? new Dictionary<string, DisplayableMessageContentDto>();

        foreach (var showcase in showcases.Data.Where(s => s.Items is { Count: > 0 }))
        foreach (var item in showcase.Items)
        {
            var ipm = item.Adapt<ShowcaseItemPlainDto>();
            ipm.ShowcaseType = showcase.ShowcaseType;
            ipm.RequiredKycStages ??= new List<ShowcaseItemKycStageDto>();

            if (contents.TryGetValue(item.DisplayableMessageId, out var content))
            {
                ipm.Title = content.Title;
                ipm.Text = content.Text;
            }

            result.Add(ipm);
        }

        return ResultList<ShowcaseItemPlainDto>.Ok(result);
    }
}