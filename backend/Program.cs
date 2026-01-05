using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using INFWAD.Calendar.Backend.Data;
using INFWAD.Calendar.Backend.GraphQL;
using INFWAD.Calendar.Backend.Models;
using INFWAD.Calendar.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Check if we're running in seed mode
if (args.Length > 0 && args[0].ToLower() == "seed")
{
    await RunSeedAsync(builder.Configuration);
    return;
}

// Configuration
var configuration = builder.Configuration;

// Connection string via env var MYSQL_CONNECTION or appsettings
var mysqlConn = Environment.GetEnvironmentVariable("MYSQL_CONNECTION")
               ?? configuration.GetConnectionString("DefaultConnection");

// JWT Configuration
var jwtKey = configuration["Jwt:Key"] ?? "DefaultSecretKeyForDevelopmentOnlyPleaseChangeInProduction123!";
var jwtIssuer = configuration["Jwt:Issuer"] ?? "INFWAD.Calendar";
var jwtAudience = configuration["Jwt:Audience"] ?? "INFWAD.Calendar.Client";

// Services
builder.Services.AddPooledDbContextFactory<AppDbContext>(options =>
    options.UseMySql(mysqlConn, ServerVersion.AutoDetect(mysqlConn))
);

// Auth Service
builder.Services.AddSingleton<IAuthService, AuthService>();

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization();

builder.Services
    .AddGraphQLServer()
    .AddAuthorization()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddType<Event>()
    .AddType<User>()
    .AddType<Group>()
    .AddType<Room>()
    .AddType<UserOfficeAttendance>()
    .AddType<EventAttendee>()
    .AddType<GroupMembership>()
    .AddType<AuthPayload>()
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
        .AllowAnyMethod()
        .AllowCredentials());
});

var app = builder.Build();

app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => Results.Redirect("/graphql"));
app.MapGraphQL("/graphql");

app.Run();

static async Task RunSeedAsync(IConfiguration configuration)
{
    var mysqlConn = Environment.GetEnvironmentVariable("MYSQL_CONNECTION")
                   ?? configuration.GetConnectionString("DefaultConnection");

    if (string.IsNullOrEmpty(mysqlConn))
    {
        Console.Error.WriteLine("Error: Database connection string not found.");
        Environment.Exit(1);
    }

    var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
    optionsBuilder.UseMySql(mysqlConn, ServerVersion.AutoDetect(mysqlConn));

    using var context = new AppDbContext(optionsBuilder.Options);
    var authService = new AuthService(configuration);
    var seeder = new DataSeeder(context, authService);

    try
    {
        await seeder.SeedAsync();
        Console.WriteLine("Seed operation completed successfully.");
        Environment.Exit(0);
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Error seeding database: {ex.Message}");
        Console.Error.WriteLine(ex.StackTrace);
        Environment.Exit(1);
    }
}
