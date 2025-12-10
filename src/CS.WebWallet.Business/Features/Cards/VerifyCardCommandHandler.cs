using CS.Identity.Client.Services;
using CS.Orchestrator.GrpcClient;
using CS.Orchestrator.GrpcClient.Cards.Requests;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Cards;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CS.WebWallet.Business.Features.Cards;

public class VerifyCardCommand : IRequest<Result<VerificationDto>>
{
    public string CardId { get; set; }
    public string SecurityCode { get; set; }
    public string SuccessUrl { get; set; }
    public string FailureUrl { get; set; }
    public string IpAddress { get; set; }
}

public class VerifyCardValidator : AbstractValidator<VerifyCardCommand>
{
    public VerifyCardValidator()
    {
        RuleFor(e => e.CardId).NotEmpty().WithMessage("Please select card you need to verify");
        RuleFor(e => e.SecurityCode).NotEmpty().WithMessage("Please set your card security code");
    }
}

public class VerifyCardCommandHandler : IRequestHandler<VerifyCardCommand, Result<VerificationDto>>
{
    private readonly ICardService _cardService;
    private readonly ICurrentUserService _userService;
    private readonly ILogger<VerifyCardCommandHandler> _logger;

    public VerifyCardCommandHandler(
        ICardService cardService,
        ICurrentUserService userService,
        ILogger<VerifyCardCommandHandler> logger)
    {
        _cardService = cardService;
        _userService = userService;
        _logger = logger;
    }

    public async Task<Result<VerificationDto>> Handle(VerifyCardCommand request, CancellationToken cancellationToken)
    {
        var result = await _cardService.VerifyCard(new VerifyCardRequest
        {
            CardId = request.CardId,
            ClientId = _userService.GetClientId(),
            SecurityCode = request.SecurityCode,
            FailureUrl = request.FailureUrl,
            SuccessUrl = request.SuccessUrl,
            IpAddress = request.IpAddress
        }, cancellationToken);

        if (result.Success)
            return Result<VerificationDto>.Ok(new VerificationDto {Url = result.Data.Url});

        _logger.LogWarning("Could not verify client {Id} card: {Message}", _userService.GetClientId(), result.Message);
        return Result<VerificationDto>.Failed(result);
    }
}