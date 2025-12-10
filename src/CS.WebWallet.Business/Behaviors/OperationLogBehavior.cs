using System.Diagnostics;
using System.Text.Json;
using CS.Identity.Client.Services;
using CS.Sdk.ServiceBus.Abstractions;
using CS.WebWallet.Business.Behaviors.Helpers;
using CS.WebWallet.Business.Helpers;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.Net.Http.Headers;
using IResult = CS.Sdk.Commons.Models.IResult;

namespace CS.WebWallet.Business.Behaviors;

public class OperationLogBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private const string AppHeader = "App";
    private const string ServiceName = "Web-wallet";
    private readonly IHttpContextAccessor _accessor;

    private readonly IServiceBus _serviceBus;
    private readonly ICurrentUserService _userService;

    public OperationLogBehavior(
        IHttpContextAccessor accessor,
        ICurrentUserService userService,
        IServiceBus serviceBus)
    {
        _accessor = accessor;
        _userService = userService;
        _serviceBus = serviceBus;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var builder = OperationLogEventBuilder.New();
        var clientId = _userService.GetClientId();
        if (clientId > 0)
            builder.WithClientId(clientId);

        Activity.Current?.AddBaggage("request.source", ServiceName);
        try
        {
            var headers = _accessor.HttpContext?.Request.Headers.ToDictionary(
                e => e.Key,
                e => e.Key == HeaderNames.Authorization && !string.IsNullOrWhiteSpace(e.Value)
                    ? e.Value.Any() && e.Value.First().Length > 20 ? e.Value.ToString()[20..] : string.Empty
                    : e.Value.ToString()) ?? new Dictionary<string, string>();

            headers.TryAdd(AppHeader, ServiceName);
            builder.WithRequestData(
                _accessor.HttpContext?.Request.Path.ToString() ?? string.Empty,
                JsonSerializer.Serialize(request),
                _accessor.HttpContext?.Request.QueryString.ToString() ?? string.Empty,
                _accessor.HttpContext?.Request.Method ?? string.Empty,
                _accessor.GetIp(),
                _accessor.HttpContext?.TraceIdentifier,
                _accessor.HttpContext?.Features.Get<IRequestCultureFeature>()?.RequestCulture.Culture.Name,
                headers);

            var sw = Stopwatch.StartNew();
            var result = await next();
            if (result is IResult response)
                builder.WithResponseData(response.StatusCode);

            sw.Stop();

            return result;
        }
        finally
        {
            await _serviceBus.Publish(builder.Build(), cancellationToken);
        }
    }
}