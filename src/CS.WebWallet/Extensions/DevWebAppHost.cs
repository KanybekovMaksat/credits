using System.Diagnostics;

namespace CS.WebWallet.Extensions;

internal class DevWebAppHost : IHostedService
{
    private readonly IWebHostEnvironment _environment;
    private Process _webAppProcess;

    public DevWebAppHost(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await Task.Yield();
        if (!_environment.IsDevelopment())
            return;

        var path = AppDomain.CurrentDomain.BaseDirectory.Contains("Debug", StringComparison.OrdinalIgnoreCase)
            ? $"{AppDomain.CurrentDomain.BaseDirectory.Split("bin")[0]}client\\"
            : AppDomain.CurrentDomain.BaseDirectory;
        _webAppProcess = Process.Start(new ProcessStartInfo
        {
            UseShellExecute = true, 
            WorkingDirectory = path,
            Arguments = "dev",
            FileName = "yarn",
        });
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _webAppProcess?.Close();
        _webAppProcess?.Dispose();
        return Task.CompletedTask;
    }
}