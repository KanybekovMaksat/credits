using CS.Ledger.Contracts.Commons.Enums;

namespace CS.WebWallet.Business.Models.Accounts;

public class AccountOwnerDto
{
    public string Id { get; set; }

    public Guid LedgerId { get; set; }

    public string Name { get; set; }

    public ClientType Type { get; set; }
}