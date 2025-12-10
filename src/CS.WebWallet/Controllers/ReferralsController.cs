using System.Net;
using CS.Sdk.Commons.Models;
using CS.Sdk.Commons.Models.PagedRequest;
using CS.WebWallet.Business.Features.Referrals;
using CS.WebWallet.Business.Models.Referrals;
using CS.WebWallet.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CS.WebWallet.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class ReferralsController : BaseAuthController
{
    private readonly IMediator _mediator;

    public ReferralsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("token")]
    [ProducesResponseType(typeof(Result<ClientReferralDataDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetReferralToken(CancellationToken token)
        => this.Response(await _mediator.Send(new GetReferralTokenQuery(), token));

    [HttpPost("history")]
    [ProducesResponseType(typeof(PagedResult<ReferralHistoryDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetHistory(
        [FromBody] PageContext<ReferralHistoryPageFilter> filter, CancellationToken token)
        => this.Respond(await _mediator.Send(new GetReferralHistoryQuery(filter), token));
}