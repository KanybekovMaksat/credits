using CS.Ledger.Contracts.Commons.Enums;

namespace CS.WebWallet.Business.Helpers;

internal static class ReceiptExtensions
{
    private const string TypeTransfer = "Transfer";
    private const string TypeExternalTransfer = "External Transfer";
    private const string TypePayment = "Payment";
    private const string TypeWithdraw = "Withdraw";
    private const string TypeExchangeSell = "Sell";
    private const string TypeExchangeBuy = "Buy";
    private const string TypeOther = "Other";

    public static string GetReceiptOperationType(this DocumentOperationType opType)
        => opType switch
        {
            DocumentOperationType.Undefined => TypeOther,
            DocumentOperationType.CryptoWalletExternalDeposit => TypeExternalTransfer,
            DocumentOperationType.TransferToMaster => TypeOther,
            DocumentOperationType.TransferToColdWallet => TypeOther,
            DocumentOperationType.TransferToHotWallet => TypeOther,
            DocumentOperationType.InternalTransfer => TypeTransfer,
            DocumentOperationType.ExternalTransfer => TypeExternalTransfer,
            DocumentOperationType.CryptoExchange => TypeExchangeSell,
            DocumentOperationType.FiatInCard => TypePayment,
            DocumentOperationType.CryptoBuy => TypeExchangeBuy,
            DocumentOperationType.CryptoSale => TypeExchangeSell,
            DocumentOperationType.CryptoExchangeCross => TypeExchangeSell,
            DocumentOperationType.OutToCard => TypeWithdraw,
            DocumentOperationType.CryptoDiscount => TypeOther,
            DocumentOperationType.CryptoProblem => TypeOther,
            DocumentOperationType.CryptoMove => TypeOther,
            DocumentOperationType.CryptoBuyCross => TypeExchangeBuy,
            DocumentOperationType.CryptoSaleCross => TypeExchangeSell,
            DocumentOperationType.BankPayment => TypePayment,
            DocumentOperationType.TransferToExpenses => TypeOther,
            DocumentOperationType.TransferToRevenue => TypeOther,
            DocumentOperationType.FiatOutBankTransfer => TypeWithdraw,
            DocumentOperationType.Manual => TypeOther,
            DocumentOperationType.BackupFromMaster => TypeOther,
            DocumentOperationType.ExternalOutBankTransfer => TypeOther,
            DocumentOperationType.BuyCryptoAndTransfer => TypeOther,
            _ => TypeOther
        };
}