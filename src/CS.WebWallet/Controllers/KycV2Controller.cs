using System.Net;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Features.Kyc;
using CS.WebWallet.Business.Models.Commons;
using CS.WebWallet.Business.Models.Kyc;
using CS.WebWallet.Business.Models.Kyc.v2;
using CS.WebWallet.Extensions;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CS.WebWallet.Controllers;

[Route("/api/v2/kyc")]
[ApiController]
public class KycV2Controller : BaseAuthController
{
    private readonly IMediator _mediator;

    public KycV2Controller(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get client KYC status
    /// </summary>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpGet("status")]
    [ProducesResponseType(typeof(Result<KycStatusDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetStatus(CancellationToken token)
        => this.Respond(await _mediator.Send(new GetClientKycStatusQuery(), token));

    /// <summary>
    /// Get personal info
    /// </summary>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpGet("personal")]
    [ProducesResponseType(typeof(Result<KycPersonalInfoDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetPersonalInfo(CancellationToken token)
        => this.Respond(await _mediator.Send(new GetClientPersonalQuery(), token));

    /// <summary>
    /// Set client E-mail
    /// </summary>
    /// <param name="request"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpPost("email")]
    [ProducesResponseType(typeof(Result<CodeDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> SetMail([FromBody] SetEmailRequest request, CancellationToken token)
        => this.Respond(await _mediator.Send(request.Adapt<SetClientEmailCommand>(), token));

    /// <summary>
    /// Set client's phone
    /// </summary>
    /// <param name="request"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpPost("phone")]
    [ProducesResponseType(typeof(Result<CodeDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> SetPhone([FromBody] SetPhoneRequest request, CancellationToken token)
        => this.Respond(await _mediator.Send(request.Adapt<SetClientPhoneCommand>(), token));

    /// <summary>
    /// Confirm client's stage with code
    /// </summary>
    /// <param name="request"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpPost("confirm")]
    [ProducesResponseType(typeof(Result<CodeDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> ConfirmWithCode([FromBody] ConfirmWithCodeRequest request, CancellationToken token)
        => this.Respond(await _mediator.Send(request.Adapt<ConfirmWithCodeCommand>(), token));

    /// <summary>
    /// Re-send confirmation code
    /// </summary>
    /// <param name="request"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpPost("resend")]
    [ProducesResponseType(typeof(Result<CodeDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> ResendCode([FromBody] ResendCodeRequest request, CancellationToken token)
        => this.Respond(await _mediator.Send(request.Adapt<ResendCodeCommand>(), token));

    /// <summary>
    /// Ser personal info
    /// </summary>
    /// <param name="request"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpPost("personal")]
    [ProducesResponseType(typeof(Result), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> ConfirmWithCode([FromBody] SetPersonalInfoRequest request, CancellationToken token)
        => this.Respond(await _mediator.Send(request.Adapt<SetPersonalInfoCommand>(), token));

    /// <summary>
    /// Add KYC documents
    /// </summary>
    /// <param name="request"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpPost("documents")]
    [ProducesResponseType(typeof(Result), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> AddDocuments([FromForm] AddKycDocumentsRequest request, CancellationToken token)
        => this.Respond(await _mediator.Send(
            new AddKycDocumentsCommand
            {
                Back = request.Back,
                Front = request.Front,
                DocumentType = request.DocumentType,
                StageId = request.StageId
            }, token));

    [HttpPost("change/phone")]
    [ProducesResponseType(typeof(Result<ChangePhoneMailDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> ChangePhone([FromBody] ChangePhoneMailModel model, CancellationToken token)
    {
        var result = await _mediator.Send(new ChangePhoneMailCommand
        {
            Code = model.Code,
            NewValue = model.NewValue,
            CountryId = model.CountryId,
            Step = model.Step,
            Type = ChangeType.Phone,
            Metadata = new RequestMetadataDto
            {
                IpAddress = Metadata.IpAddress,
                UserAgent = Metadata.UserAgent
            }
        }, token);
        return this.Respond(result);
    }

    [HttpPost("change/mail")]
    [ProducesResponseType(typeof(Result<ChangePhoneMailDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> ChangeMail([FromBody] ChangePhoneMailModel model, CancellationToken token)
    {
        var result = await _mediator.Send(new ChangePhoneMailCommand
        {
            Code = model.Code,
            NewValue = model.NewValue,
            Step = model.Step,
            Type = ChangeType.Mail,
            Metadata = new RequestMetadataDto
            {
                IpAddress = Metadata.IpAddress,
                UserAgent = Metadata.UserAgent
            }
        }, token);
        return this.Respond(result);
    }

    [HttpPost("avatar", Name = nameof(UpdateAvatar))]
    [ProducesResponseType(200, Type = typeof(Result))]
    public async Task<IActionResult> UpdateAvatar([FromForm] UploadAvatarCommand command)
    {
        return this.Response(await _mediator.Send(command));
    }
}