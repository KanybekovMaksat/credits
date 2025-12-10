using SkiaSharp;

namespace CS.WebWallet.Business.Services;

internal class ImageProcessor : IImageProcessor
{
    public Task<Stream> ScaleImage(
        Stream input, 
        int maxWidth = ScalingConfig.MaxWidth,
        int maxHeight = ScalingConfig.MaxHeight,
        CancellationToken token = default)
    {
        using var stream = new SKManagedStream(input);
        using var inputBmp = SKBitmap.Decode(stream);
        if (inputBmp.Height <= maxWidth && inputBmp.Width <= maxHeight)
        {
            return Task.FromResult(input);
        }

        var scale = inputBmp.Width > inputBmp.Height
            ? (float)maxWidth / inputBmp.Width
            : (float)maxHeight / inputBmp.Height;

        var widthScaled = (int)(inputBmp.Width * scale);
        var heightScaled = (int)(inputBmp.Height * scale);

        using var surface = SKSurface.Create(
            new SKImageInfo(widthScaled, heightScaled, SKColorType.Rgba8888, SKAlphaType.Premul));
        using var canvas = surface.Canvas;
        canvas.Clear(SKColors.White);

        var info = new SKImageInfo(widthScaled, heightScaled, SKColorType.Rgba8888, SKAlphaType.Premul);
        using var scaledBitmap = new SKBitmap(info);
        inputBmp.ScalePixels(scaledBitmap, SKFilterQuality.High);
        using var resizedImage = SKImage.FromBitmap(inputBmp);

        using var paint = new SKPaint();
        canvas.DrawBitmap(scaledBitmap, 0, 0, paint);
        using var image = surface.Snapshot();
        var data = image.Encode(SKEncodedImageFormat.Jpeg, 90);

        return Task.FromResult(data.AsStream());
    }
}