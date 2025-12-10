using CS.References.Contracts.Common.Enums;
using CS.References.GrpcClient.Contracts;
using CS.References.GrpcClient.Models.Requests;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Languages;
using Mapster;
using MediatR;

namespace CS.WebWallet.Business.Features.Languages;

public class GetTranslationsVersionsQuery : IRequest<ResultList<TranslationVersionDto>>
{
    public string Iso6391 { get; set; }
}

public class GetTranslationsVersionsQueryHandler(IApplicationLanguageService applicationLanguageService)
    : IRequestHandler<GetTranslationsVersionsQuery, ResultList<TranslationVersionDto>>
{
    public async Task<ResultList<TranslationVersionDto>> Handle(
        GetTranslationsVersionsQuery request, CancellationToken cancellationToken)
    {
        var req = new GetApplicationLanguageVersionRequest()
        {
            Iso6391 = request.Iso6391,
            AppType = ApplicationType.WebWallet
        };

        var result = await applicationLanguageService.GetVersions(req, cancellationToken);

        return result.Success
            ? ResultList<TranslationVersionDto>.Ok(
                result.Data?
                    .Select(a => a.Adapt<TranslationVersionDto>())
                    .ToList())
            : ResultList<TranslationVersionDto>.Failed(result);
    }
}