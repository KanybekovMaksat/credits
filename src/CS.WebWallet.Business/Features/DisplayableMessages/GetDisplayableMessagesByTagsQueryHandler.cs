using CS.References.Contracts.Common.Enums;
using CS.References.GrpcClient.Contracts;
using CS.References.GrpcClient.Models.DisplayableMessages.Requests;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.DisplayableMessages;
using Mapster;
using MediatR;

namespace CS.WebWallet.Business.Features.DisplayableMessages;

public class GetDisplayableMessagesByTagsQuery : IRequest<ResultList<MessagesByTagsDto>>
{
    public string Iso6391 { get; set; }
    public List<MessagesByTagsTagFilter> Tags { get; set; }
}

public class GetDisplayableMessagesByTagsQueryHandler(IDisplayableMessagesService displayableMessages)
    : IRequestHandler<GetDisplayableMessagesByTagsQuery, ResultList<MessagesByTagsDto>>
{
    public async Task<ResultList<MessagesByTagsDto>> Handle(
        GetDisplayableMessagesByTagsQuery request, CancellationToken cancellationToken)
    {
        var req = request.Adapt<GetMessagesByTagsRequest>();
        req.ApplicationType = ApplicationType.WebWallet;

        var messages = await displayableMessages.GetMessagesByTags(req, cancellationToken);

        return messages.Success
            ? ResultList<MessagesByTagsDto>.Ok((messages.Data ?? []).Select(a => a.Adapt<MessagesByTagsDto>()))
            : ResultList<MessagesByTagsDto>.Failed(messages);
    }
}