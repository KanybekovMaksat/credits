using System.ComponentModel.DataAnnotations;
using System.Net;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Features.Languages;
using CS.WebWallet.Business.Models.Languages;
using CS.WebWallet.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CS.WebWallet.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class TranslationsController(ISender mediator) : ControllerBase
{
    /// <summary>
    /// Get translations versions
    /// </summary>
    /// <returns></returns>x
    [HttpGet("versions")]
    [ProducesResponseType(200, Type = typeof(ResultList<TranslationVersionDto>))]
    public async Task<IActionResult> TranslationsVersions([FromQuery] string iso6391)
    {
        return this.Respond(await mediator
            .Send(new GetTranslationsVersionsQuery { Iso6391 = iso6391 }, HttpContext.RequestAborted));
    }

    /// <summary>
    /// Returns translation data
    /// </summary>
    /// <param name="iso6391"></param>
    /// <returns></returns>
    [HttpGet("{iso6391}")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetTranslationData([FromRoute] [Required] string iso6391)
    {
        var data = await mediator.Send(new GetTranslationDataQuery(iso6391));
        return data.Success ? Ok(data.Data) : Ok(new { Data = ArraySegment<string>.Empty });
    }
}