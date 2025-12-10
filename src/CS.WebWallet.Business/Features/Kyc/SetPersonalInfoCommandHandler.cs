using System.Text.RegularExpressions;
using CS.Contracts.GrpcClient.Kyc.Contracts;
using CS.Contracts.GrpcClient.Kyc.Contracts.ClientSide.Requests;
using CS.Identity.Client.Services;
using CS.Sdk.Commons.Models;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CS.WebWallet.Business.Features.Kyc;

public class SetPersonalInfoCommand : IRequest<Result>
{
    public int StageId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Nationality { get; set; }
    public string PlaceOfBirth { get; set; }
    public string CountryId { get; set; }
    public string City { get; set; }
    public string PostalCode { get; set; }
    public string Street { get; set; }
    public string State { get; set; }
    public string Building { get; set; }
    public string Flat { get; set; }
    public DateTime DateOfBirth { get; set; }
}

public class SetPersonalInfoValidator : AbstractValidator<SetPersonalInfoCommand>
{
    private static readonly Regex Regex = new("[^a-zA-Z \\-'`]+", RegexOptions.Compiled);

    public SetPersonalInfoValidator()
    {
        RuleFor(e => e.StageId).NotEmpty().WithMessage("KYC stage is not defined");
        RuleFor(e => e.CountryId).NotEmpty().WithMessage("Country residency should be set");
        RuleFor(e => e.City).NotEmpty().WithMessage("City should be set");
        RuleFor(e => e.PostalCode).NotEmpty().WithMessage("Postal code should be set");
        RuleFor(e => e.FirstName).Custom((e, ctx) =>
        {
            if (string.IsNullOrWhiteSpace(e))
            {
                ctx.AddFailure("Firstname should be set");
                return;
            }

            if (Regex.IsMatch(e))
            {
                ctx.AddFailure("Firstname should contain only latin letters and  -, ' chars");
            }
        });
        RuleFor(e => e.LastName).Custom((e, ctx) =>
        {
            if (string.IsNullOrWhiteSpace(e))
            {
                ctx.AddFailure("Lastname should be set");
                return;
            }

            if (Regex.IsMatch(e))
            {
                ctx.AddFailure("Lastname should contain only latin letters and  -, ' chars");
            }
        });
    }
}

public class SetPersonalInfoCommandHandler(
    IKycClientService kycService,
    ICurrentUserService userService)
    : IRequestHandler<SetPersonalInfoCommand, Result>
{
    public async Task<Result> Handle(SetPersonalInfoCommand request, CancellationToken cancellationToken)
    {
        return await kycService.SetPersonalInfo(
            new SetPersonalInfoRequest
            {
                Building = request.Building,
                City = request.City,
                Flat = request.Flat,
                State = request.State,
                Street = request.Street,
                BuildingNumber = request.Building,
                ClientId = userService.GetClientId(),
                CountryId = request.CountryId,
                FirstName = request.FirstName,
                LastName = request.LastName,
                PostalCode = request.PostalCode,
                StageId = request.StageId,
                DateOfBirth = request.DateOfBirth,
                Nationality = request.Nationality,
                PlaceOfBirth = request.PlaceOfBirth,
            }, cancellationToken);
    }
}