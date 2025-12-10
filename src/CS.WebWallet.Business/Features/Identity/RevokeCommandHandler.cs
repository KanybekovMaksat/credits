using CS.Identity.Client.Services.Models.Constants;
using CS.Sdk.Commons.Models;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;

namespace CS.WebWallet.Business.Features.Identity;

public class RevokeCommand : IRequest<Result>
{
}

public class RevokeCommandHandler : IRequestHandler<RevokeCommand, Result>
{
    private readonly IHttpContextAccessor _accessor;

    public RevokeCommandHandler(IHttpContextAccessor accessor)
    {
        _accessor = accessor;
    }

    public async Task<Result> Handle(RevokeCommand request, CancellationToken cancellationToken)
    {
        if (_accessor.HttpContext is null)
            return Result.Ok();
        
        await _accessor.HttpContext.SignOutAsync(Constants.TempCookieScheme);
        await _accessor.HttpContext.SignOutAsync(Constants.GeneralCookieScheme);
        return Result.Ok();
    }
}