using System.Net;
using CS.Sdk.Commons.Models;
using CS.Sdk.Commons.Models.PagedRequest;
using CS.WebWallet.Business.Features.History;
using CS.WebWallet.Business.Models.History;
using CS.WebWallet.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CS.WebWallet.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class HistoryController : BaseAuthController
{
    private readonly IMediator _mediator;

    public HistoryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [ProducesResponseType(typeof(PagedResult<HistoryRecordDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetHistory([FromBody] PageContext<HistoryPageFilter> context)
        => this.Respond(await _mediator.Send(new GetHistoryQuery(context), HttpContext.RequestAborted));

    [HttpGet("{entryId}")]
    [HttpGet("{entryId}/{accountId?}")]
    [ProducesResponseType(typeof(Result<HistoryRecordDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetDetailedHistory([FromRoute] Guid entryId, Guid? accountId)
        => this.Respond(await _mediator.Send(new GetDetailedHistoryQuery(entryId, accountId)));
}