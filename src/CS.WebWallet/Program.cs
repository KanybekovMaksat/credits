using System.Security.Claims;
using cs.healthz.probes;
using CS.Identity.Contracts.Commons.Constants;
using CS.WebWallet.Business;
using CS.WebWallet.Extensions;
using Flour.Logging;
using Flour.Otel;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.OpenApi.Models;

const string serviceName = "Web-wallet";

// host
var builder = WebApplication.CreateBuilder(args);
builder.Host.UseLogging();

// Registrations
builder.Services
    .AddTracing(builder.Configuration, (act, req) =>
    {
        act?.AddBaggage("request.source", serviceName);
        act?.AddBaggage("request.trace.id", req.HttpContext.TraceIdentifier);

        var hasAuth = req.HttpContext.User.Identity?.IsAuthenticated == true;
        if (!hasAuth)
            return;

        var context = req.HttpContext;
        var clientId = context.User.FindFirstValue(AppClaims.ClientId);
        var userId = context.User.FindFirstValue(AppClaims.UserId);
        var providerId = context.User.FindFirstValue(AppClaims.ProviderId);

        if (!string.IsNullOrWhiteSpace(clientId) && int.TryParse(clientId, out _))
            act?.AddBaggage("client.id", clientId);

        if (!string.IsNullOrWhiteSpace(userId) && int.TryParse(userId, out _))
            act?.AddBaggage("user.id", userId);

        if (!string.IsNullOrWhiteSpace(providerId) && int.TryParse(providerId, out _))
            act?.AddBaggage("provider.id", providerId);
    }, "otel")
    .AddControllers().Services
    .AddBusiness(builder.Configuration)
    .AddHealthzChecks().UseServiceBusCheck().UseRedisCheck().Services
    .AddSpaStaticFiles(e => e.RootPath = "dist");

if (!builder.Environment.IsProduction())
    builder.Services
        .AddHostedService<DevWebAppHost>();

// App
var app = builder.Build();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
#pragma warning disable ASP0014
app.UseEndpoints(_ => { });
#pragma warning restore ASP0014
app.Use((ctx, next) =>
{
    if (!ctx.Request.Path.StartsWithSegments("/api") &&
        !ctx.Request.Path.StartsWithSegments("/files") &&
        !ctx.Request.Path.StartsWithSegments("/swagger")) return next();
    ctx.Response.StatusCode = 404;
    return Task.CompletedTask;
});

app.UseSpaStaticFiles();
app.UseSpa(spa =>
{
    if (builder.Environment.IsDevelopment())
        spa.UseProxyToSpaDevelopmentServer("http://127.0.0.1:3001");
});

var healthSettings = new HealthCheckOptions
{
    AllowCachingResponses = false,
    ResponseWriter = (ctx, report) => ctx.Response.WriteAsJsonAsync(report),
};
app.MapHealthChecks("/healthz/startup", healthSettings);
app.MapHealthChecks("/healthz/alive", healthSettings);
app.MapHealthChecks("/healthz/ready", healthSettings);

app.MapControllers();

app.Run();