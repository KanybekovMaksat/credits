using CS.Banking.GrpcClient.Contracts;
using CS.Banking.GrpcClient.Contracts.Requests.Cards;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Cards;
using FluentValidation;
using Mapster;
using MediatR;

namespace CS.WebWallet.Business.Features.Cards;

public class SetIssuedCardPasswordCommand : IRequest<Result<CardFrameUrlDto>>
{
    public string CardId { get; set; }
    public string Password { get; set; }
    public string PasswordConfirm { get; set; }
}

public class SetIssuedCardPasswordValidator : AbstractValidator<SetIssuedCardPasswordCommand>
{
    public SetIssuedCardPasswordValidator()
    {
        RuleFor(e => e.CardId).NotEmpty().WithMessage("Card should be specified");
        RuleFor(e => e).Custom((e, ctx) =>
        {
            // if (string.IsNullOrEmpty(e.Password))
            // {
            //     ctx.AddFailure("Card password should be set");
            //     return;
            // }
            //
            // if (e.Password != e.PasswordConfirm)
            // {
            //     ctx.AddFailure("Card passwords are not the same");
            //     return;
            // }
            //
            // if (e.Password.Length is < 8 or > 30)
            //     ctx.AddFailure("Card password length should be minimum 8 and maximum 30 characters long");
        });
    }
}

public class SetIssuedCardPasswordCommandHandler
    : IRequestHandler<SetIssuedCardPasswordCommand, Result<CardFrameUrlDto>>
{
    private readonly IBankCustomersService _customersService;
    private readonly ICurrentUserService _userService;

    public SetIssuedCardPasswordCommandHandler(
        IBankCustomersService customersService,
        ICurrentUserService userService)
    {
        _customersService = customersService;
        _userService = userService;
    }

    public async Task<Result<CardFrameUrlDto>> Handle(
        SetIssuedCardPasswordCommand request, CancellationToken cancellationToken)
    {
        var result = await _customersService.SetCardPassword(
            new SetCardPasswordRequest
            {
                CardId = request.CardId,
                Password = request.Password, 
                ClientId = _userService.GetClientId()
            }, cancellationToken);

        return result.Success
            ? Result<CardFrameUrlDto>.Ok(result.Data.Adapt<CardFrameUrlDto>())
            : Result<CardFrameUrlDto>.Failed(result);
    }
}