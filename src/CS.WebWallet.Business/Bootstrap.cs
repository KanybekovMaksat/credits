using System.Security.Claims;
using CS.AntiFraud.GrpcClient;
using CS.Banking.GrpcClient;
using CS.Contracts.GrpcClient;
using CS.Contracts.GrpcClient.Kyc;
using CS.Exchange.GrpcClient;
using CS.Exchange.RatesStore;
using CS.FileService;
using cs.healthz.GrpcClient;
using CS.Identity.Client.Services;
using CS.Identity.Client.Services.Models.Constants;
using CS.Identity.Contracts.Commons.Constants;
using CS.Identity.Web.Client;
using CS.Ledger.Client.MobileApi;
using CS.Ledger.Stores;
using CS.Loyalty.GrpcClient;
using CS.Orchestrator.GrpcClient;
using CS.Receipts.Abstractions;
using CS.References.GrpcClient;
using CS.Sdk.Commons.GRPC.MediatR;
using CS.SDK.Redis;
using CS.SDK.Redis.DistributedCache;
using CS.Sdk.ServiceBus.MassTransit.RabbitMq.DependencyInjection;
using CS.WebWallet.Business.Behaviors;
using CS.WebWallet.Business.Services;
using FluentValidation;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CS.WebWallet.Business;

public static class Bootstrap
{
    public static IServiceCollection AddBusiness(this IServiceCollection services, IConfiguration configuration)
    {
        TypeAdapterConfig.GlobalSettings.Scan(typeof(Bootstrap).Assembly);
        FontLoader.LoadCalibri();

        var settings = new WalletSettings();
        configuration.GetSection("app").Bind(settings);

        return services
            .Configure<WalletSettings>(e => configuration.GetSection("app").Bind(e))
            .AddCsMediatr(null, typeof(Bootstrap))
            .AddCsAuth(
                configuration, 
                builder => builder
                    .AddCustomPolicy(
                        AuthExtensions.TempWalletPolicy,
                        auth => auth
                            .AddAuthenticationSchemes(Constants.TempCookieScheme)
                            .RequireAuthenticatedUser()
                            .RequireClaim(ClaimTypes.Role, Constants.Customer)
                            .RequireClaim(AppClaims.ProviderId, "1"))
                    .AddCustomPolicy(
                        AuthExtensions.WalletPolicy,
                        auth => auth
                            .AddAuthenticationSchemes(Constants.GeneralCookieScheme)
                            .RequireAuthenticatedUser()
                            .RequireClaim(ClaimTypes.Role, Constants.Customer)
                            .RequireClaim(AppClaims.ProviderId, "1"))
                    .AddCookieScheme(settings.Scheme, settings.Domain))
            .AddValidatorsFromAssembly(typeof(Bootstrap).Assembly)
            .AddTransient(typeof(IPipelineBehavior<,>), typeof(OperationLogBehavior<,>))
            .AddWebIdentityClient(configuration, "apis:identity")
            .AddClientKyc(configuration, "apis:contracts")
            .AddReferencesClient(configuration, "apis:references")
            .AddExchangeClient(configuration)
            .AddMobileApiService(configuration, "apis:ledger")
            .AddOrchestrator(configuration, "apis:orchestrator")
            .AddContractsClients(configuration, "apis:contracts")
            .AddClientLoyalty(configuration)
            .AddAntiFraudClient(configuration, "apis:antifraud")
            .AddBankingCustomersClient(configuration, "apis:banking")
            .AddHealthz(configuration)
            .AddHttpContextAccessor()
            .AddTransient<IImageProcessor, ImageProcessor>()
            .AddScoped<IIconsCache, IconsCache>()
            .AddSingleton<IActionContextAccessor, ActionContextAccessor>()
            .AddScoped(provider =>
            {
                var actionContext = provider.GetRequiredService<IActionContextAccessor>().ActionContext;
                var urlFactory = provider.GetRequiredService<IUrlHelperFactory>();
                return urlFactory.GetUrlHelper(actionContext!);
            })
            .AddCsFileService(configuration)
            .AddMassTransitRabbitMq(configuration, consumersAssemblies: typeof(Bootstrap).Assembly)
            .AddRedis(configuration)
            .AddRatesStore()
            .AddCurrenciesStore()
            .AddDistributedCacheRedis();
    }
}