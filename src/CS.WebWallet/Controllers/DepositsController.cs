using System.Net;
using CS.Sdk.Commons.Models;
using CS.Sdk.Commons.Models.PagedRequest;
using CS.WebWallet.Business.Features.Deposits;
using CS.WebWallet.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CS.WebWallet.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class DepositsController(ISender mediator) : BaseAuthController
{
    [HttpGet]
    [ProducesResponseType(typeof(Result<ClientDepositsInfoDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetClientDeposits(
        [FromQuery] GetClientDepositsQuery request, CancellationToken token)
        => this.Respond(await mediator.Send(request, token));

    [HttpPost("constructor")]
    [ProducesResponseType(typeof(Result<DepositConstructorDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetDepositConstructor(
        [FromBody] GetDepositConstructorQuery request, CancellationToken token)
        => this.Respond(await mediator.Send(request, token));

    [HttpPost]
    [ProducesResponseType(typeof(Result), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> AddDepositRequest(
        [FromBody] AddDepositRequestCommand request, CancellationToken token)
        => this.Respond(await mediator.Send(request, token));

    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(Result), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> CloseClientDeposit(
        string id, CancellationToken token)
        => this.Respond(await mediator.Send(new CloseClientDepositCommand(id), token));

    [HttpPost("{id}/calendar")]
    [ProducesResponseType(typeof(PagedResult<InterestCalendarRowDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetInterestCalendar(string id,
        [FromBody] PageContext<InterestCalendarPageFilter> context, CancellationToken token)
        => this.Respond(await mediator
            .Send(new GetClientDepositInterestCalendarQuery(context) { ClientDepositId = id }, token));
}