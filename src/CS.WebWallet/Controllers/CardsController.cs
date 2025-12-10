using System.Net;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Features.Cards;
using CS.WebWallet.Business.Models.Cards;
using CS.WebWallet.Business.Models.Payments;
using CS.WebWallet.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CS.WebWallet.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class CardsController(IMediator mediator) : BaseAuthController
{
    [HttpGet("list")]
    [ProducesResponseType(typeof(ResultList<ClientCardDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetCards(CancellationToken token)
        => this.Respond(await mediator.Send(new GetClientCardsQuery(), token));

    [HttpPost]
    [ProducesResponseType(typeof(Result<ClientCardDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> AddCard([FromBody] CardDetailsDto card, CancellationToken token)
        => this.Respond(await mediator.Send(new AddCardCommand(card), token));

    [HttpPost("verify")]
    [ProducesResponseType(typeof(Result<VerificationDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> VerifyCard([FromBody] VerifyCardCommand command, CancellationToken token)
    {
        command.IpAddress = Metadata.IpAddress;
        var result = await mediator.Send(command, token);
        return this.Respond(result);
    }

    [HttpDelete("{cardId}")]
    [ProducesResponseType(typeof(Result), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> DeleteCard([FromRoute] string cardId, CancellationToken token)
        => this.Respond(await mediator.Send(new DeleteCardCommand(cardId), token));

    [HttpGet("issued/list")]
    [ProducesResponseType(typeof(ResultList<IssuedCardDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetIssuedCards(CancellationToken token)
        => this.Respond(await mediator.Send(new GetIssuedCardsQuery(), token));

    [HttpPost("issued/requisites")]
    [ProducesResponseType(typeof(Result<IssuedCardRequisitesDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetIssuedCardRequisites(
        [FromBody] GetIssuedCardRequisitesQuery query, CancellationToken token)
        => this.Respond(await mediator.Send(query, token));

    /// <summary>
    /// Activate card
    /// </summary>
    /// <param name="command">Request body</param>
    /// <param name="token"></param>
    /// <remarks>At the moment can activate only cards with status 1 (Inactive)</remarks>
    /// <returns></returns>
    [HttpPost("issued/activate")]
    [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(Result<ChangeCardStatusDto>))]
    public async Task<IActionResult> ActivateCard([FromBody] ActivateIssuedCardCommand command, CancellationToken token)
        => this.Respond(await mediator.Send(command, token));

    /// <summary>
    /// Confirm issued card activation
    /// </summary>
    /// <param name="command"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpPost("issued/activate/confirm")]
    [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(Result))]
    public async Task<IActionResult> ConfirmActivateCard(
        [FromBody] ConfirmIssuedCardActivationCommand command, CancellationToken token)
        => this.Respond(await mediator.Send(command, token));

    /// <summary>
    /// Change card status
    /// </summary>
    /// <param name="command">request</param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpPut("issued/status")]
    [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(Result))]
    public async Task<IActionResult> ChangeStatus(
        [FromBody] ChangeIssuedCardStatusCommand command, CancellationToken token)
        => this.Response(await mediator.Send(command, token));

    [HttpDelete("issued/{cardId}")]
    [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(Result))]
    public async Task<IActionResult> DeleteIssuedCard(
        [FromRoute] string cardId, CancellationToken token)
        => this.Response(await mediator.Send(new DeleteIssuedCardCommand(cardId), token));

    /// <summary>
    /// Set issued card password
    /// </summary>
    /// <param name="command"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpPost("issued/password")]
    [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(Result<CardFrameUrlDto>))]
    public async Task<IActionResult> SetCardPassword(
        [FromBody] SetIssuedCardPasswordCommand command, CancellationToken token)
        => this.Response(await mediator.Send(command, token));

    /// <summary>
    /// Set issued card PIN
    /// </summary>
    /// <param name="command"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpPost("issued/pin")]
    [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(Result<CardFrameUrlDto>))]
    public async Task<IActionResult> SetCardPin([FromBody] SetIssuedCardPinCommand command, CancellationToken token)
        => this.Response(await mediator.Send(command, token));
}