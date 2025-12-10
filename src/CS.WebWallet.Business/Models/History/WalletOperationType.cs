namespace CS.WebWallet.Business.Models.History;

public enum WalletOperationType
{
    Unknown,
    Transfer,
    Withdraw,
    TopUp,
    Exchange,
    BuyCrypto,
    BankTransfer,
    BankTransferCommission,
    CardSpend,
}