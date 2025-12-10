using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using CS.Identity.Client.Services;
using CS.Identity.Client.Services.Models.Constants;
using CS.Identity.Contracts.Commons.Dto;
using CS.Identity.Web.Client.Contracts;
using CS.Identity.Web.Client.Contracts.Models;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Features.Identity.Models;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CS.WebWallet.Business.Features.Identity;

public class ConfirmEntryCodeCommand : IRequest<Result<AuthDto>>
{
    public string Code { get; set; }
}

public class ConfirmEntryCodeCommandHandler(
    ICurrentUserService currentUserService,
    IWebIdentityService webWalletIdentityService,
    IHttpContextAccessor accessor,
    IOptions<WalletSettings> options,
    ILogger<ConfirmEntryCodeCommandHandler> logger)
    : IRequestHandler<ConfirmEntryCodeCommand, Result<AuthDto>>
{
    public async Task<Result<AuthDto>> Handle(
        ConfirmEntryCodeCommand request,
        CancellationToken cancellationToken)
    {
        var user = currentUserService.GetCurrentUser();
        var response = await webWalletIdentityService.ConfirmEntryCode(new ConfirmEntryCodeRequest
        {
            Code = request.Code,
            UserId = user.Id,
            Jti = user.Jti
        }, cancellationToken);

        if (!response.Success)
        {
            logger.LogWarning("Could not confirm entry code");
            return Result<AuthDto>.Failed(response);
        }

        await SignIn(response.Data);

        var result = response.Data.Adapt<AuthDto>();
        return Result<AuthDto>.Ok(result);
    }

    private async Task SignIn(ResponseTokenDto apiResponse)
    {
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(apiResponse.Access);

        var claims = token.Claims.Where(e => e.Type != "exp").ToList();
        claims.Add(new Claim(ClaimTypes.Role, claims.Find(e => e.Type == "role").Value));

        var notDefault = !string.IsNullOrWhiteSpace(options.Value.Domain) &&
                         (accessor.HttpContext?.Request.Host.Host.EndsWith(options.Value.Domain) ?? false);

        var scheme = notDefault ? options.Value.Scheme : Constants.GeneralCookieScheme;

        var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, scheme));

        if (accessor.HttpContext != null)
        {
            await accessor.HttpContext.SignOutAsync(notDefault ? $"{scheme}-tmp" : Constants.TempCookieScheme);
            await accessor.HttpContext.SignInAsync(
                scheme, principal, new AuthenticationProperties { IsPersistent = true });
        }
    }
}