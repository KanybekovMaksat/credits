using System.Net;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Features.Transfers;
using CS.WebWallet.Business.Models.Payments;
using CS.WebWallet.Business.Models.Transfers;
using CS.WebWallet.Business.Models.Transfers.Crypto;
using CS.WebWallet.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CS.WebWallet.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class TransfersController(IMediator mediator) : BaseAuthController
{
    [HttpGet("requisites")]
    [ProducesResponseType(typeof(Result<PaymentRequisitesCheckDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetPaymentRequisites([FromQuery] GetPaymentRequisitesQuery query)
        => this.Respond(await mediator.Send(query, HttpContext.RequestAborted));

    [HttpGet("rate")]
    [ProducesResponseType(typeof(Result<string>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetRate([FromQuery] GetExchangeRateQuery query, CancellationToken token)
        => this.Respond(await mediator.Send(query, token));

    [HttpPost("check")]
    [ProducesResponseType(typeof(Result<TransferCheckDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> TransferCheck([FromBody] OperationInfoRequest query)
        => this.Respond(await mediator.Send(new CommonTransferInfoQuery(query), HttpContext.RequestAborted));

    [HttpPost("submit")]
    [ProducesResponseType(200, Type = typeof(Result<OperationSubmitResponse>))]
    public async Task<IActionResult> SubmitOperation([FromBody] SubmitRequest request)
        => this.Response(await mediator.Send(new SubmitOperationCommand(request)));
    
    [HttpPost("otp/resend")]
    [ProducesResponseType(200, Type = typeof(Result<OtpDto>))]
    public async Task<IActionResult> ResendOtp([FromBody] ResendOtp request)
        => this.Response(await mediator.Send(request));
}