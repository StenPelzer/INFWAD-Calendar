# INFWAD Calendar Backend

This is a scaffolded ASP.NET Core 9 backend configured with Hot Chocolate (GraphQL) and EF Core using Pomelo MySQL provider.

Quick start

1. With dotnet (requires .NET 9 SDK installed):

```bash
cd backend
dotnet restore
dotnet build
dotnet run
```

The GraphQL endpoint will be available at http://localhost:5000/graphql

2. With Docker Compose (recommended for local dev):

```bash
docker compose up --build
```

This will start a MySQL instance and the backend. The backend receives a connection string via the `MYSQL_CONNECTION` env var in `docker-compose.yml`.

Configuration

- `appsettings.Development.json` contains a sample connection string for local development. Prefer using `MYSQL_CONNECTION` env var for production or Docker.
- CORS is enabled for `http://localhost:3000` (React dev server) by default.

GraphQL schema (examples)

- Query all events:

```graphql
query {
  events {
    id
    title
    description
    startTime
    endTime
  }
}
```

- Mutation create event:

```graphql
mutation {
  createEvent(input: { title: "Meeting", description: "Team sync", startTime: "2025-01-01T09:00:00Z", endTime: "2025-01-01T10:00:00Z" }) {
    id
    title
  }
}
```

Applying migrations

Install the EF tools and create migrations locally:

```bash
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate -p backend -s backend
dotnet ef database update -p backend -s backend
```

Notes

- This is a scaffold to get started. You should secure credentials, add proper logging and health checks, and add tests/integration as needed.
