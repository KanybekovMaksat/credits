using CS.Ledger.Contracts.Commons.Enums;
using CS.WebWallet.Business.Models.Accounts;

namespace CS.WebWallet.Business.Helpers;

internal static class AccountsListExtensions
{
    public static void SetOperations(
        this List<AccountRefDto> accounts,
        Dictionary<string, Dictionary<string, decimal>> exchanges)
    {
        foreach (var account in accounts ?? [])
        {
            switch (account.Type)
            {
                case (int)AccountType.Crypto:
                    SetExchanges(account, accounts, exchanges);
                    SetTransfers(account, accounts, null, [OperationRequirement.ExternalCryptoWallet]);
                    break;
                case (int)AccountType.Finance:
                    SetTopUps(
                        account, accounts,
                        [AccountType.Cards, AccountType.FinancePrepaid],
                        [OperationRequirement.BankRequisites]);
                    SetTransfers(
                        account,
                        accounts,
                        [AccountType.FinancePrepaid, AccountType.Cards],
                        [OperationRequirement.FullBankRequisites]);
                    break;
                case (int)AccountType.FinancePrepaid:
                    SetExchanges(account, accounts, exchanges);
                    SetTopUps(
                        account, accounts,
                        [AccountType.Finance],
                        [OperationRequirement.ClientCard, OperationRequirement.BankRequisites]);
                    SetTransfers(
                        account,
                        accounts,
                        [AccountType.Finance],
                        [
                            OperationRequirement.ClientCard,
                            OperationRequirement.BankRequisites,
                            OperationRequirement.FullBankRequisitesSwift
                        ]);
                    break;
                case (int)AccountType.Shares:
                    account.Operations.TopUp = exchanges
                        .Where(e => e.Value.Any(a => a.Key == account.Ticker))
                        .SelectMany(e => (accounts ?? new List<AccountRefDto>()).Where(a => a.Ticker == e.Key)
                            .Select(a => new OperationDetails { From = a.AccountId })).ToList();
                    break;
                case (int)AccountType.Cards:
                    SetTopUps(
                        account, accounts,
                        [AccountType.Finance, AccountType.FinancePrepaid],
                        null);
                    SetTransfers(
                        account,
                        accounts,
                        [AccountType.Finance],
                        null);
                    break;
            }
        }
    }

    private static void SetTransfers(
        AccountRefDto account,
        List<AccountRefDto> accounts,
        AccountType[] toTypes,
        OperationRequirement[] requirements)
    {
        toTypes ??= Array.Empty<AccountType>();
        requirements ??= Array.Empty<OperationRequirement>();

        account.Operations.Transfer.AddRange(accounts
            .Where(e => e.AccountId != account.AccountId &&
                        e.CurrencyId == account.CurrencyId &&
                        (toTypes.Length == 0 || toTypes.Contains((AccountType)e.Type)))
            .Select(e => new OperationDetails { To = e.AccountId }));

        account.Operations.Transfer.AddRange(requirements.Select(e => new OperationDetails { Requirement = e }));
    }

    private static void SetTopUps(
        AccountRefDto account,
        List<AccountRefDto> accounts,
        AccountType[] fromTypes,
        OperationRequirement[] requirements)
    {
        fromTypes ??= Array.Empty<AccountType>();
        requirements ??= Array.Empty<OperationRequirement>();

        account.Operations.TopUp.AddRange(accounts
            .Where(e => e.AccountId != account.AccountId &&
                        e.CurrencyId == account.CurrencyId &&
                        (fromTypes.Length == 0 || fromTypes.Contains((AccountType)e.Type)))
            .Select(e => new OperationDetails { From = e.AccountId }));

        account.Operations.TopUp.AddRange(requirements.Select(e => new OperationDetails { Requirement = e }));
    }

    private static void SetExchanges(
        AccountRefDto account,
        List<AccountRefDto> allAccounts,
        Dictionary<string, Dictionary<string, decimal>> exchanges)
    {
        if (account.Type is (int)AccountType.Finance or (int)AccountType.Cards)
            return;

        if (!exchanges.TryGetValue(account.Ticker, out var assets))
            return;

        var accounts = allAccounts.Where(e =>
                e.AccountId != account.AccountId &&
                e.Type is (int)AccountType.Crypto or (int)AccountType.Shares or (int)AccountType.FinancePrepaid)
            .ToLookup(e => e.Ticker);

        foreach (var asset in assets.Where(asset => accounts.Contains(asset.Key)))
        {
            account.Operations.Exchange.AddRange(
                accounts[asset.Key].Select(e => new OperationDetails { Rate = asset.Value, To = e.AccountId, }));
        }
    }
}