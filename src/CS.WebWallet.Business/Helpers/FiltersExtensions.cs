namespace CS.WebWallet.Business.Helpers;

public static class FiltersExtensions
{
    public static (DateTime? from, DateTime? to) GetRange(this DateTime? from, DateTime? to)
    {
        from = from?.Date;
        to = to?.Date.AddDays(1);

        if (!from.HasValue || !to.HasValue)
        {
            return (from, to);
        }

        if (from > to)
        {
            to = null;
        }

        return (from, to);
    }
}