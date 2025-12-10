using System.Text.Json;
using CS.OperationLog.Contract.Events;

namespace CS.WebWallet.Business.Behaviors.Helpers;

internal class OperationLogEventBuilder
{
    private readonly ClientRequestLogEvent _event = new();

    private OperationLogEventBuilder()
    {
    }

    /// <summary>
    /// </summary>
    /// <returns></returns>
    public static OperationLogEventBuilder New()
    {
        return new();
    }

    /// <summary>
    /// </summary>
    /// <param name="requestPath"></param>
    /// <param name="requestBody"></param>
    /// <param name="requestQueries"></param>
    /// <param name="requestMethod"></param>
    /// <param name="requestIp"></param>
    /// <param name="traceId"></param>
    /// <param name="locale"></param>
    /// <param name="headers"></param>
    /// <returns>OperationLogEventBuilder</returns>
    public OperationLogEventBuilder WithRequestData(
        string requestPath,
        string requestBody,
        string requestQueries,
        string requestMethod,
        string requestIp,
        string traceId,
        string locale,
        Dictionary<string, string> headers)
    {
        _event.RequestPath = requestPath;
        _event.RequestBody = requestBody;
        _event.RequestQueries = requestQueries;
        _event.RequestMethod = requestMethod;
        _event.IpAddress = requestIp;
        _event.RequestHeaders = JsonSerializer.Serialize(headers);
        _event.RequestTime = DateTime.UtcNow;
        _event.TraceId = traceId;
        _event.Locale = locale;
        return this;
    }

    /// <summary>
    /// </summary>
    /// <param name="statusCode"></param>
    /// <returns>OperationLogEventBuilder</returns>
    public OperationLogEventBuilder WithResponseData(int statusCode)
    {
        _event.ResponseStatusCode = statusCode;
        _event.ResponseTime = DateTime.UtcNow;
        return this;
    }

    /// <summary>
    /// </summary>
    /// <param name="clientId"></param>
    /// <returns>OperationLogEventBuilder</returns>
    public OperationLogEventBuilder WithClientId(int clientId)
    {
        _event.ClientId = clientId;
        return this;
    }

    /// <summary>
    /// </summary>
    /// <returns>OperationLogEvent</returns>
    public ClientRequestLogEvent Build()
    {
        return _event;
    }
}