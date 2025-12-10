using CS.Contracts.GrpcClient.Contracts;
using CS.Contracts.GrpcClient.Contracts.Requests.Tariffs;
using CS.Contracts.GrpcClient.Contracts.Responses.Tariffs;
using CS.Identity.Client.Services;
using CS.References.GrpcClient.Contracts;
using CS.References.GrpcClient.Models.DisplayableMessages.Requests;
using CS.References.GrpcClient.Models.DisplayableMessages.Responses;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Kyc.v2;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CS.WebWallet.Business.Features.Tariffs;

public class TariffDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Title { get; set; }
    public string Summary { get; set; }

    public int PaymentPeriod { get; set; }
    public string FeeCurrency { get; set; }
    public string FeeAmount { get; set; }
    public string PreviousFeeAmount { get; set; }
    public string InitialFeeAmount { get; set; }
    public string PreviousInitialFeeAmount { get; set; }
    public string Icon { get; set; }
    public string Eula { get; set; }
    public string EulaLink { get; set; }
    public string Link { get; set; }

    public bool NeedToAcceptEula { get; set; }
    public bool CanBeRequested { get; set; }
    public bool Requested { get; set; }
    public bool IsCurrent { get; set; }
    public string Message { get; set; }

    public KycStageStatusDto[] RequiredKycStages { get; set; }
}

public class GetTariffsQuery : IRequest<ResultList<TariffDto>>
{
}

public class GetTariffsHandler : IRequestHandler<GetTariffsQuery, ResultList<TariffDto>>
{
    private readonly ITariffsService _tariffsService;
    private readonly IDisplayableMessagesService _messagesService;
    private readonly ICurrentUserService _userService;
    private readonly IHttpContextAccessor _accessor;

    public GetTariffsHandler(
        ITariffsService tariffsService,
        IDisplayableMessagesService messagesService,
        ICurrentUserService userService,
        IHttpContextAccessor accessor)
    {
        _tariffsService = tariffsService;
        _messagesService = messagesService;
        _userService = userService;
        _accessor = accessor;
    }

    public async Task<ResultList<TariffDto>> Handle(GetTariffsQuery request, CancellationToken cancellationToken)
    {
        var clientId = _userService.GetClientId();
        var lang = _accessor.HttpContext?.Request.Headers["ww-lang"];
        var tariffsResult = await _tariffsService.GetAvailableTariffs(
            new GetAvailableTariffsRequest { ClientId = clientId }, cancellationToken);

        if (!tariffsResult.Success)
            return ResultList<TariffDto>.Failed(tariffsResult);

        var tariffs = (tariffsResult.Data ?? new List<AvailableTariffResponse>()).ToList();
        if (tariffs.Count == 0)
            return ResultList<TariffDto>.Ok(ArraySegment<TariffDto>.Empty);

        var messageIds = tariffs.SelectMany(e => new[] { e.TitleId, e.DescriptionId })
            .Where(e => !string.IsNullOrWhiteSpace(e)).ToList();

        var contents = ((await _messagesService.GetContentForMessages(
                    new GetContentForMessagesRequest { Ids = messageIds, Iso6391 = lang ?? "EN" }, cancellationToken))
                .Data ?? ArraySegment<DisplayableMessageContentDto>.Empty)
            .ToDictionary(e => e.DisplayableMessageId);

        return ResultList<TariffDto>.Ok(tariffs.Select(e => new TariffDto
        {
            Id = e.Id,
            Name = contents.TryGetValue(e.TitleId, out var title) ? title.Title : string.Empty,
            Description = title?.Text,
            Title = contents.TryGetValue(e.DescriptionId, out var description) ? description.Title : string.Empty,
            Summary = description?.Text,
            Message = e.Message,
            PaymentPeriod = (int)e.PaymentPeriod,
            Requested = e.Requested,
            CanBeRequested = e.CanBeRequested,
            FeeAmount = e.FeeAmount.ToString("F2"),
            InitialFeeAmount = e.InitialFeeAmount.ToString("F2"),
            PreviousFeeAmount = e.PreviousFeeAmount?.ToString("F2"),
            PreviousInitialFeeAmount = e.PreviousInitialFeeAmount?.ToString("F2"),
            FeeCurrency = "EUR",
            NeedToAcceptEula = e.NeedToAcceptEULA,
            Eula = e.EULA,
            EulaLink = e.EULALink,
            IsCurrent = e.IsCurrent,
            Link = e.Link,
            Icon = e.Icon,
            RequiredKycStages = e.RequiredKycStages?.Select(s => s.Adapt<KycStageStatusDto>()).ToArray()
                                ?? Array.Empty<KycStageStatusDto>(),
        }));
    }
}