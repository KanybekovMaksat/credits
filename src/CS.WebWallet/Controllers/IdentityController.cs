using System.Net;
using CS.Identity.Client.Services;
using CS.Identity.Client.Services.Models;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business;
using CS.WebWallet.Business.Features.Identity;
using CS.WebWallet.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CS.WebWallet.Controllers;

[Route("/api/identity")]
[ApiController]
public class IdentityController(ISender mediator) : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginCommand request, CancellationToken token)
        => this.Respond(await mediator.Send(request, token));

    [HttpPost]
    [Route("confirm-code")]
    [Authorize(AuthExtensions.TempWalletPolicy)]
    public async Task<IActionResult> Totp([FromBody] ConfirmEntryCodeCommand request, CancellationToken token)
        => this.Respond(await mediator.Send(request, token));

    [HttpGet("ping")]
    [Authorize(AuthExtensions.WalletPolicy)]
    public Result Ping() => Result.Ok("pong");

    [HttpGet("me")]
    [Authorize(AuthExtensions.WalletPolicy)]
    public Result<ICurrentUser> Me(ICurrentUserService userService)
    {
        var user = userService.GetCurrentUser();
        return Result<ICurrentUser>.Ok(
            new CurrentUser { Id = user.Id, Provider = user.Provider, ClientId = user.ClientId });
    }

    [HttpPost]
    [Route("logout")]
    [ProducesResponseType(typeof(Result), (int)HttpStatusCode.OK)]
    [Authorize(AuthExtensions.WalletPolicy)]
    public async Task<IActionResult> Logout(CancellationToken token)
    {
        return this.Respond(await mediator.Send(new RevokeCommand(), token));
    }
}