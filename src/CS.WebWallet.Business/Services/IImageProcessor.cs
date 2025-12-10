namespace CS.WebWallet.Business.Services;

public class ScalingConfig
{
    public const int MaxWidth = 4000;
    public const int MaxHeight = 5320;
}

public interface IImageProcessor
{
    Task<Stream> ScaleImage(
        Stream input,
        int maxWidth = ScalingConfig.MaxWidth,
        int maxHeight = ScalingConfig.MaxHeight,
        CancellationToken token = default);
}