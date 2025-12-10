using System.Net;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Features.Tariffs;
using CS.WebWallet.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CS.WebWallet.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class TariffsController : BaseAuthController
{
    private readonly IMediator _mediator;

    public TariffsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ResultList<TariffDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetCurrentTariff()
        => this.Respond(await _mediator.Send(new GetTariffsQuery()));
    
    [HttpPost("{tariffId}")]
    [ProducesResponseType(typeof(ResultList<TariffDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> ActivateTariff([FromRoute] string tariffId)
        => this.Respond(await _mediator.Send(new ActivateTariffCommand(tariffId)));
}