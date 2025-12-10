using CS.WebWallet.Business.Features.Reports;
using CS.WebWallet.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CS.WebWallet.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class ReportsController : BaseAuthController
{
    private readonly IMediator _mediator;

    public ReportsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("statement/pdf")]
    [ProducesResponseType(200, Type = typeof(FileStreamResult))]
    public async Task<IActionResult> GetStatement([FromQuery] GetStatementFileQuery query, CancellationToken token)
    {
        var result = await _mediator.Send(query, token);
        return result.Success
            ? File(result.Data.Blob, result.Data.MimeType, result.Data.Name)
            : this.Respond(result);
    }
}