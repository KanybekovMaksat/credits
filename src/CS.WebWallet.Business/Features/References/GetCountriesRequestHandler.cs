using CS.References.GrpcClient.Contracts;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.References;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CS.WebWallet.Business.Features.References;

public class GetCountriesQuery : IRequest<ResultList<CountryDto>>
{
}

public class GetCountriesRequestHandler : IRequestHandler<GetCountriesQuery, ResultList<CountryDto>>
{
    private readonly ILogger<GetCountriesRequestHandler> _logger;
    private readonly IReferencesService _referencesService;

    public GetCountriesRequestHandler(
        IReferencesService referencesService,
        ILogger<GetCountriesRequestHandler> logger)
    {
        _referencesService = referencesService;
        _logger = logger;
    }

    public async Task<ResultList<CountryDto>> Handle(
        GetCountriesQuery query,
        CancellationToken cancellationToken)
    {
        var result = await _referencesService.GetCountries(cancellationToken);
        if (!result.Success)
            return ResultList<CountryDto>.Failed(result);

        return ResultList<CountryDto>.Ok(result.Data?.Select(e => new CountryDto
        {
            Id = e.Id,
            Name = e.Name,
            NativeName = e.NativeName,
            IsBlocked = e.IsBlocked,
            PhoneCodes = e.CallingCodes?.ToList()
        }) ?? new List<CountryDto>());
    }
}