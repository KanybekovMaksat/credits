using System.Text.Json.Serialization;
using CS.Sdk.Commons.Extensions;
using StackExchange.Redis;

namespace CS.WebWallet.Business.Services;

public class Icon
{
    [JsonIgnore] public byte[] Data { get; set; }
    public string Mime { get; set; }
    public string Bytes { get; set; }
}

public interface IIconsCache
{
    Task<Icon> Get(string key);
    Task Set(string key, Icon data);
}

internal class IconsCache : IIconsCache
{
    private readonly IConnectionMultiplexer _multiplexer;

    public IconsCache(IConnectionMultiplexer multiplexer)
    {
        _multiplexer = multiplexer;
    }

    public async Task<Icon> Get(string key)
    {
        var blob = await _multiplexer.GetDatabase().StringGetAsync($"blob:{key}");
        if (!blob.HasValue)
            return null;
        var icon = blob.ToString().FromJson<Icon>();
        if (string.IsNullOrWhiteSpace(icon.Bytes))
            return null;
        
        icon.Data = icon.Bytes?.ToBytes();
        return icon;
    }

    public Task Set(string key, Icon data)
    {
        if (data.Data is null || data.Data.Length == 0)
            return Task.CompletedTask; 
        data.Bytes = data.Data.FromBytes();
        return _multiplexer.GetDatabase().StringSetAsync($"blob:{key}", data.ToJson(), TimeSpan.FromHours(1));
    }
}