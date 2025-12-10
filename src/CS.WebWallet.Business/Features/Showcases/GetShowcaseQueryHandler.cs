using CS.Contracts.GrpcClient.Contracts;
using CS.Contracts.GrpcClient.Contracts.Models.Showcases.GetShowcaseItem;
using CS.References.Contracts.Common.Enums;
using CS.References.GrpcClient.Contracts;
using CS.References.GrpcClient.Models.DisplayableMessages.Requests;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Showcases;
using Mapster;
using MediatR;

namespace CS.WebWallet.Business.Features.Showcases;

public class GetShowcaseItemQuery : IRequest<Result<ShowcaseItemDto>>
{
    public int Id { get; set; }
    public string Iso6391 { get; set; }
}

public class GetShowcaseQueryHandler : IRequestHandler<GetShowcaseItemQuery, Result<ShowcaseItemDto>>
{
    private readonly IShowcasesService _showcases;
    private readonly IDisplayableMessagesService _messages;

    public GetShowcaseQueryHandler(IShowcasesService showcases, IDisplayableMessagesService messages)
    {
        _showcases = showcases;
        _messages = messages;
    }

    public async Task<Result<ShowcaseItemDto>> Handle(GetShowcaseItemQuery request, CancellationToken cancellationToken)
    {
        var item = await _showcases
            .GetShowcaseItem(new GetShowcaseItemRequest { Id = request.Id }, cancellationToken);
        
        if (!item.Success)
            return Result<ShowcaseItemDto>.Failed(item);
        
        var contents = await _messages
            .GetContentForMessages(new GetContentForMessagesRequest
            {
                Iso6391 = request.Iso6391,
                ApplicationType = ApplicationType.WebWallet,
                Ids = new List<string>() { item.Data?.DisplayableMessageId }
            }, cancellationToken);

        var result = item.Adapt<ShowcaseItemDto>();
        
        if(!contents.Success)
            return Result<ShowcaseItemDto>.Ok(result);
        
        var content = contents.Data?.FirstOrDefault();
        
        if (content is null) 
            return Result<ShowcaseItemDto>.Ok(result);
        
        result.Title = content.Title;
        result.Text = content.Text;

        return Result<ShowcaseItemDto>.Ok(result);
    }
}