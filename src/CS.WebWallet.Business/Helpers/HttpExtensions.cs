using System.Diagnostics;
using CS.Orchestrator.Contracts.Common.Models;
using Microsoft.AspNetCore.Http;

namespace CS.WebWallet.Business.Helpers;

public static class HttpExtensions
{
    private const string Forwarded = "X-Forwarded-For";
    private const string RealIp = "X-Real-Ip";
    private const string Ua = "User-Agent";

    public static string GetIp(this IHttpContextAccessor accessor)
        => accessor.HttpContext?.Request.Headers[RealIp].ToString() ??
           accessor.HttpContext?.Request.Headers[Forwarded].ToString().Split(',')[0];
    
    public static ClientMetaDto GetMetadata(this IHttpContextAccessor accessor)
    {
        var headers = accessor.HttpContext?.Request.Headers;
        if (headers is null)
            return new ClientMetaDto();
        return new ClientMetaDto
        {
            Ip = headers[RealIp],
            Platform = "web",
            UserAgent = headers[Ua],
            RequestTraceId = accessor.HttpContext?.TraceIdentifier,
            Source = Activity.Current?.GetBaggageItem("request.source"),
        };
    }
}