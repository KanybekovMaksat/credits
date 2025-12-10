using System.Net;
using CS.Sdk.Commons.Models;
using CS.Sdk.Commons.Models.PagedRequest;
using CS.WebWallet.Business.Features.Accounts;
using CS.WebWallet.Business.Models.Accounts;
using CS.WebWallet.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CS.WebWallet.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class AccountsController(IMediator mediator) : BaseAuthController
{
    [HttpPost("page")]
    [ProducesResponseType(typeof(PagedResult<AccountRefDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetPage([FromBody] PageContext<GetAccountsFilter> context, CancellationToken token)
        => this.Respond(await mediator.Send(new GetAccountsPageQuery { Context = context }, token));
}