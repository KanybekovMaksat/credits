using CS.Sdk.Commons.Models;
using MediatR;

namespace CS.WebWallet.Business.Features.Languages;

public class GetTranslationDataQuery(string iso6391) : IRequest<Result<string>>
{
    public string Iso6391 { get; } = iso6391;
}

public class GetTranslationDataQueryHandler(ISender mediator, HttpClient client)
    : IRequestHandler<GetTranslationDataQuery, Result<string>>
{
    public async Task<Result<string>> Handle(GetTranslationDataQuery request, CancellationToken cancellationToken)
    {
        var isAvailable = await mediator
            .Send(new GetTranslationsVersionsQuery { Iso6391 = request.Iso6391 }, cancellationToken);

        if (!isAvailable.Success)
            return Result<string>.Failed(isAvailable);

        var translation = isAvailable.Data?.MaxBy(e => e.Version);

        if (translation is null)
            return Result<string>.NotFound("Can't find requested translation data.");

        if (!translation.Iso6391.Equals(request.Iso6391, StringComparison.OrdinalIgnoreCase))
            return Result<string>.NotFound("Language not found");

        return Result<string>.Ok(await client.GetStringAsync(translation.FileReference, cancellationToken));
    }
}