FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["INFWAD.Calendar.Backend.csproj", "./"]
RUN dotnet restore "INFWAD.Calendar.Backend.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet publish "INFWAD.Calendar.Backend.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "INFWAD.Calendar.Backend.dll"]
