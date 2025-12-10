using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using CS.Identity.Client.Services.Models.Constants;
using CS.Identity.Contracts.Commons.Dto;
using CS.Identity.Web.Client.Contracts;
using CS.Sdk.Commons.Extensions;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Features.Identity.Models;
using FluentValidation;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CS.WebWallet.Business.Features.Identity;

public class LoginCommand : IRequest<Result<AuthDto>>
{
    public string Token { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
    public string CountryId { get; set; }
    public string AppKey { get; set; }
    public string Referral { get; set; }
    public bool TermsAccepted { get; set; }
    public Dictionary<string, string> ReferralParams { get; set; }
}

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(e => e.Email).NotEmpty()
            .When(e => string.IsNullOrWhiteSpace(e.Phone))
            .WithMessage("Email and phone number cannot be empty");
        
        RuleFor(e => e.Phone).NotEmpty()
            .When(e => string.IsNullOrWhiteSpace(e.Email))
            .WithMessage("Phone number cannot be empty");
        
        RuleFor(e => e.CountryId).NotEmpty()
            .When(e => !string.IsNullOrWhiteSpace(e.Phone))
            .WithMessage("Country ISO code cannot be empty");
        
        RuleFor(e => e.Phone).Custom((e, context) =>
        {
            if (!e.IsPhoneValid(context.InstanceToValidate.CountryId))
                context.AddFailure(nameof(LoginCommand.Phone),
                    "Invalid phone number! Make sure that you entered a valid phone.");
        }).When(e => !string.IsNullOrWhiteSpace(e.Phone));
        
        RuleFor(e => e.Email).Custom((e, context) =>
        {
            if(!MailAddress.TryCreate(e, out _))
                context.AddFailure("Invalid email address! Make sure that you entered a valid email.");
        }).When(e => !string.IsNullOrWhiteSpace(e.Email));

        RuleFor(e => e.AppKey).NotEmpty().WithMessage("Application key cannot be empty");
    }
}

public class LoginCommandHandler(
    IWebHostEnvironment environment,
    IWebIdentityService webWalletIdentityService,
    IHttpContextAccessor accessor,
    IOptions<WalletSettings> options,
    ILogger<LoginCommandHandler> logger)
    : IRequestHandler<LoginCommand, Result<AuthDto>>
{
    public async Task<Result<AuthDto>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var response = await webWalletIdentityService.Login(new ClientLoginRequest()
        {
            Phone = request.Phone,
            Email = request.Email,
            Referral = request.Referral,
            ReferralParams = request.ReferralParams,
            AppKey = request.AppKey,
            CountryId = request.CountryId,
            Metadata = new ClientMetadata
            {
                TermsAccepted = request.TermsAccepted,
                Source = "Web-wallet",
                DevicePlatform = "webapp",
                IpAddress = accessor.HttpContext?.Request.Headers["X-Real-IP"],
                UserAgent = accessor.HttpContext?.Request.Headers["User-Agent"],
                CaptchaToken = request.Token
            }
        }, cancellationToken);
        if (!response.Success)
        {
            logger.LogWarning("Failed to login");
            return Result<AuthDto>.Failed(response);
        }

        await SignIn(response.Data);

        var result = response.Data.Adapt<AuthDto>();
        return Result<AuthDto>.Ok(new AuthDto { Code = !environment.IsProduction() ? result.Code : null });
    }

    private async Task SignIn(ResponseTokenDto apiResponse)
    {
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(apiResponse.Access);

        var claims = token.Claims.ToList();
        claims.Add(new Claim(ClaimTypes.Role, claims.Find(e => e.Type == "role").Value));

        var scheme = !string.IsNullOrWhiteSpace(options.Value.Domain) &&
                     (accessor.HttpContext?.Request.Host.Host.EndsWith(options.Value.Domain) ?? false)
            ? $"{options.Value.Scheme}-tmp"
            : Constants.TempCookieScheme;

        var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, scheme));

        if (accessor.HttpContext != null)
            await accessor.HttpContext.SignInAsync(
                scheme, principal, new AuthenticationProperties { IsPersistent = true });
    }
}