using Microsoft.EntityFrameworkCore;
using INFWAD.Calendar.Backend.Data;
using INFWAD.Calendar.Backend.GraphQL;
using INFWAD.Calendar.Backend.Models;

var builder = WebApplication.CreateBuilder(args);

// Configuration
var configuration = builder.Configuration;

// Connection string via env var MYSQL_CONNECTION or appsettings
var mysqlConn = Environment.GetEnvironmentVariable("MYSQL_CONNECTION")
               ?? configuration.GetConnectionString("DefaultConnection");

// Services
builder.Services.AddPooledDbContextFactory<AppDbContext>(options =>
    options.UseMySql(mysqlConn, ServerVersion.AutoDetect(mysqlConn))
);

builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddType<Event>()
    .AddType<User>()
    .AddType<Group>()
    .AddType<Role>()
    .AddType<Room>()
    .AddType<UserOfficeAttendance>()
    .AddType<EventAttendee>()
    .AddType<GroupMembership>()
    .AddProjections()
    .AddFiltering()
    .AddSorting();

// CORS for React dev server
var allowedOrigin = configuration["AllowedOrigins"] ?? "http://localhost:3000";
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(p => p
        .WithOrigins(allowedOrigin)
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.MapGet("/", () => Results.Redirect("/graphql"));
app.MapGraphQL("/graphql");

app.Run();
