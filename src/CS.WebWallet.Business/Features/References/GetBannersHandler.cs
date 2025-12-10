using CS.Contracts.GrpcClient.Kyc.Contracts;
using CS.Contracts.GrpcClient.Kyc.Contracts.Shared;
using CS.Identity.Client.Services;
using CS.References.Contracts.Common.Enums;
using CS.References.GrpcClient.Contracts;
using CS.References.GrpcClient.Models.Requests.Banners;
using CS.Sdk.Commons.Models;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CS.WebWallet.Business.Features.References;

public class BannerDto
{
    public Guid Id { get; set; }
    public PagePlacement Placement { get; set; }
    public string ImageUrl { get; set; }
    public string Icon { get; set; }
    public string Link { get; set; }
    public string TextColor { get; set; }
    public string ColorOne { get; set; }
    public string ColorTwo { get; set; }
    public string Text { get; set; }
    public int TextFontSize { get; set; }
    public string Title { get; set; }
    public int TitleFontSize { get; set; }
    public string SubTitle { get; set; }
    public int SubTitleFontSize { get; set; }
    public List<string> Anchors { get; set; }
}

public class GetBannersQuery : IRequest<ResultList<BannerDto>>;

public class GetBannersHandler(
    IHttpContextAccessor accessor,
    IBannersService bannersService,
    IKycClientService kycService,
    ICurrentUserService currentUserService)
    : IRequestHandler<GetBannersQuery, ResultList<BannerDto>>
{
    public async Task<ResultList<BannerDto>> Handle(GetBannersQuery request, CancellationToken cancellationToken)
    {
        var clientId = currentUserService.GetClientId();
        var locale = accessor.HttpContext?.Request.Headers["ww-lang"].ToString().ToUpper();
        var status = await kycService.GetShortStatus(new ClientIdRequest { ClientId = clientId }, cancellationToken);
        if (!status.Success) return ResultList<BannerDto>.Ok([]);

        var banners = await bannersService.GetAppBanners(new GetClientBannersRequest
        {
            AppType = ApplicationType.WebWallet,
            ClientId = clientId,
            Locale = locale,
        }, cancellationToken);

        var filter = status.Data.Verified switch
        {
            false => new[] { ClientFilter.All, ClientFilter.NonVerified },
            true => new[] { ClientFilter.All, ClientFilter.Verified },
        };

        var result = (banners.Data ?? [])
            .Where(e => filter.Contains(e.Filter) &&
                        (!string.IsNullOrEmpty(e.ImageUrl) || !string.IsNullOrWhiteSpace(e.Text)))
            .Select(e => e.Adapt<BannerDto>()).ToList();
        return ResultList<BannerDto>.Ok(result);
    }
}