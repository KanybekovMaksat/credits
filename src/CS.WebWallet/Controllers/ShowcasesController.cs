using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Features.Showcases;
using CS.WebWallet.Business.Models.Showcases;
using CS.WebWallet.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CS.WebWallet.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class ShowcasesController : BaseAuthController
{
    private readonly IMediator _mediator;

    public ShowcasesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("list")]
    [ProducesResponseType(200, Type = typeof(ResultList<ShowcaseItemPlainDto>))]
    public async Task<IActionResult> GetShowcases([FromQuery] GetShowcasesQuery model, CancellationToken token)
        => this.Respond(await _mediator.Send(model, token));

    [HttpGet("items/{id:int}")]
    [ProducesResponseType(200, Type = typeof(ResultList<ShowcaseItemDto>))]
    public async Task<IActionResult> GetShowcaseItem([FromRoute] int id, CancellationToken token)
        => this.Respond(await _mediator.Send(new GetShowcaseItemQuery { Id = id }, token));

    [HttpPost("requests")]
    [ProducesResponseType(200, Type = typeof(Result<RequestActionsDto>))]
    public async Task<IActionResult> AddContractRequest(
        [FromBody] AddContractRequestCommand model, CancellationToken token)
        => this.Respond(await _mediator.Send(model, token));
}