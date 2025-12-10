# 🆕 CS.WebWallet

### ▶ Running and Settings

- install .NET SDK - https://dotnet.microsoft.com/en-us/download/dotnet/7.0
- install Docker desktop - https://www.docker.com/products/docker-desktop/
- run `docker run -d --name redis -p 6379:6379 redis:alpine`
- run `docker run -d --name rabbitmq -p 15672:15672 -p 5672:5672 rabbitmq:management-alpine`
- 
#### Edit host (Windows)
- edit `C:\Windows\System32\drivers\etc\hosts`, add record `127.0.0.1 bo.local.credits.de` and save

#### Edit host (Mac)
- open terminal
- enter command `sudo nano /etc/hosts`
- move to end of file
- add line `127.0.0.1 bo.local.credits.de`
- save file (press `control+x`)

#### Starting project locally
- open terminal and run command `dotnet run --project ./src/CS.WebWallet/CS.WebWallet.csproj`
- in separate terminal navigate to ./src/CS.Backoffice/client/ and run `yarn dev`
- open browser and navigate to `http://bo.local.credits.de:5210/`
- done