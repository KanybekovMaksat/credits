namespace CS.WebWallet.Business.Models.History;

public class HistoryPageFilter
{
    public WalletOperationType? OperationType { get; set; }
    public Guid? AccountId { get; set; }
}