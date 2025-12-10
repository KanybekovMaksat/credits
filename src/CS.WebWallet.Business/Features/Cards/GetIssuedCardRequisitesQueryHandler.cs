using CS.Banking.GrpcClient.Contracts;
using CS.Banking.GrpcClient.Contracts.Requests.Cards;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using CS.WebWallet.Business.Models.Cards;
using MediatR;

namespace CS.WebWallet.Business.Features.Cards;

public class GetIssuedCardRequisitesQuery : IRequest<Result<IssuedCardRequisitesDto>>
{
    public string CardId { get; set; }
}

public class GetIssuedCardRequisitesQueryHandler
    : IRequestHandler<GetIssuedCardRequisitesQuery, Result<IssuedCardRequisitesDto>>
{
    private readonly ICurrentUserService _userService;
    private readonly IBankCustomersService _bankService;

    public GetIssuedCardRequisitesQueryHandler(ICurrentUserService userService, IBankCustomersService bankService)
    {
        _userService = userService;
        _bankService = bankService;
    }

    public async Task<Result<IssuedCardRequisitesDto>> Handle(
        GetIssuedCardRequisitesQuery request, CancellationToken cancellationToken)
    {
        var result = await _bankService.GetCardRequisites(
            new ClientCardRequest { CardId = request.CardId, ClientId = _userService.GetClientId() },
            cancellationToken);

        return result.Success
            ? Result<IssuedCardRequisitesDto>.Ok(new IssuedCardRequisitesDto
            {
                Id = result.Data.CardId,
                Pan = result.Data.Pan,
                Pin = result.Data.Pin,
                Holder = result.Data.HolderName,
                ExpiryMonth = result.Data.ExpirationMonth,
                ExpiryYear = result.Data.ExpirationYear,
                Url = result.Data.Url,
            })
            : Result<IssuedCardRequisitesDto>.Failed(result);
    }
}