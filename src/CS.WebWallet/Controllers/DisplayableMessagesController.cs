using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Features.DisplayableMessages;
using CS.WebWallet.Business.Models.DisplayableMessages;
using CS.WebWallet.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CS.WebWallet.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class DisplayableMessagesController : BaseAuthController
{
    private readonly IMediator _mediator;

    public DisplayableMessagesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get displayable messages
    /// </summary>
    /// <returns></returns>
    [HttpPost(Name = nameof(GetDisplayableMessagesByTags))]
    [ProducesResponseType(200, Type = typeof(ResultList<MessagesByTagsDto>))]
    public async Task<IActionResult> GetDisplayableMessagesByTags(
        [FromBody] GetDisplayableMessagesByTagsQuery model, CancellationToken token)
        => this.Respond(await _mediator.Send(model, token));
}