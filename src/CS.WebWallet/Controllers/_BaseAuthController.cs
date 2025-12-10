using CS.WebWallet.Business;
using CS.WebWallet.Business.Models.Commons;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CS.WebWallet.Controllers;

[Authorize(AuthExtensions.WalletPolicy)]
public class BaseAuthController : ControllerBase
{
    protected RequestMetadataDto Metadata => new()
    {
        Device = Request.Headers["DevicePlatform"],
        DeviceToken = Request.Headers["DeviceToken"],
        IpAddress = string.IsNullOrWhiteSpace(Request.HttpContext.Connection.RemoteIpAddress?.ToString())
            ? Request.Headers["X-Forwarded-For"]
            : Request.HttpContext.Connection.RemoteIpAddress?.ToString(),
        UserAgent = Request.Headers["User-Agent"],
        Currency = string.IsNullOrWhiteSpace(Request.Headers["Currency"].ToString())
            ? "USD"
            : Request.Headers["Currency"].ToString()
    };
}