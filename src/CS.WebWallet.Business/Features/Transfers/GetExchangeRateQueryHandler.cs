using System.Globalization;
using CS.Identity.Client.Services;
using CS.Orchestrator.GrpcClient;
using CS.Orchestrator.GrpcClient.Processing.Requests;
using CS.Sdk.Commons.Models;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CS.WebWallet.Business.Features.Transfers;

public class GetExchangeRateQuery : IRequest<Result<string>>
{
    public int From { get; set; }
    public int To { get; set; }
}

public class GetExchangeRateQueryHandler : IRequestHandler<GetExchangeRateQuery, Result<string>>
{
    private readonly IProcessingService _processingService;
    private readonly ICurrentUserService _userService;
    private readonly ILogger<GetExchangeRateQueryHandler> _logger;

    public GetExchangeRateQueryHandler(
        IProcessingService processingService,
        ICurrentUserService userService,
        ILogger<GetExchangeRateQueryHandler> logger)
    {
        _processingService = processingService;
        _userService = userService;
        _logger = logger;
    }

    public async Task<Result<string>> Handle(
        GetExchangeRateQuery request,
        CancellationToken cancellationToken)
    {
        var result = await _processingService.GetRate(new ExchangeGetRateRequest
        {
            ClientId = _userService.GetClientId(),
            PartnerId = _userService.GetProvider(),
            BaseCurrencyId = request.From,
            QuotedCurrencyId = request.To,
        }, cancellationToken);

        if (result.Success)
            return Result<string>.Ok(result.Data.Rate.ToString(CultureInfo.InvariantCulture).TrimEnd('0') + "0");

        _logger.LogWarning("Could not get rate for {Quoted}/{Base} {Message}",
            request.From,
            request.To,
            result.Message);

        return Result<string>.Failed(result);
    }
}