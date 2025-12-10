FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/CS.WebWallet/CS.WebWallet.csproj", "src/CS.WebWallet/"]
RUN dotnet restore "src/CS.WebWallet/CS.WebWallet.csproj"
COPY . .
WORKDIR "/src/src/CS.WebWallet"
RUN dotnet build "CS.WebWallet.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CS.WebWallet.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CS.WebWallet.dll"]
