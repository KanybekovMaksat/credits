using System.Net;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business;
using CS.WebWallet.Business.Features.References;
using CS.WebWallet.Business.Models.References;
using CS.WebWallet.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CS.WebWallet.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class ReferencesController(IMediator mediator) : ControllerBase
{
    [HttpGet("countries")]
    [ProducesResponseType(typeof(ResultList<CountryDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetCountries()
        => this.Respond(await mediator.Send(new GetCountriesQuery()));
    
    [HttpGet("banners")]
    [Authorize(AuthExtensions.WalletPolicy)]
    [ProducesResponseType(typeof(ResultList<BannerDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetBanners()
        => this.Respond(await mediator.Send(new GetBannersQuery()));
}