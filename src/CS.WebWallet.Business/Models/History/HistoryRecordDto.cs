namespace CS.WebWallet.Business.Models.History;

// newer version
public class HistoryRecordDto
{
    public Guid Id { get; set; }
    public int Type { get; set; }
    public int Status { get; set; }
    public DateTime Date { get; set; }
    public bool Income { get; set; }
    public string IconUrl { get; set; }
    public HistoryValueDto Fee { get; set; }
    public HistoryValueDto Sum { get; set; }
    public OperationTransferDto Transfer { get; set; }
    public OperationWithdrawDto Withdraw { get; set; }
    public OperationTopUpDto TopUp { get; set; }
    public OperationExchangeDto Exchange { get; set; }
    public OperationBuyCryptoDto BuyCrypto { get; set; }
    public OperationBankTransferDto BankTransfer { get; set; }
}

public class HistoryRateDto
{
    public string Amount { get; set; }
    public string From { get; set; }
    public string To { get; set; }
}

public class HistoryValueDto
{
    public string Amount { get; set; }
    public string Ticker { get; set; }
    public string Name { get; set; }
    public string Symbol { get; set; }
}

public class OperationTransferDto
{
    public string Wallet { get; set; }
    public string Account { get; set; }
    public string ExplorerUrl { get; set; }
    public string ExternalId { get; set; }
}

public class OperationWithdrawDto
{
    public string Card { get; set; }
    public string Recipient { get; set; }
}

public class OperationTopUpDto
{
    public string Card { get; set; }
}

public class OperationExchangeDto
{
    public HistoryRateDto Rate { get; set; }
    public HistoryValueDto Payed { get; set; }
}

public class OperationBuyCryptoDto
{
    public string Card { get; set; }
    public string Wallet { get; set; }
    public string ExplorerUrl { get; set; }
    public string ExternalId { get; set; }
    public HistoryRateDto Rate { get; set; }
    public HistoryValueDto Payed { get; set; }
}

public class OperationBankTransferDto
{
    public int Type { get; set; }
    public string Iban { get; set; }
    public string Name { get; set; }
    public string Purpose { get; set; }
    public MerchantInfoDto Merchant { get; set; }
}

public class MerchantInfoDto
{
    public string Name { get; set; }
    public string Mcc { get; set; }
}