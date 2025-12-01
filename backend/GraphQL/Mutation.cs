using INFWAD.Calendar.Backend.Data;
using INFWAD.Calendar.Backend.Models;
using INFWAD.Calendar.Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace INFWAD.Calendar.Backend.GraphQL;

public class Mutation
{
    public async Task<AuthPayload> Register(
        RegisterInput input, 
        [Service] IDbContextFactory<AppDbContext> dbFactory,
        [Service] IAuthService authService)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        
        // Check if user already exists
        var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Email == input.Email);
        if (existingUser != null)
        {
            return new AuthPayload
            {
                Success = false,
                Error = "A user with this email already exists"
            };
        }

        var user = new User
        {
            Name = input.Name,
            Email = input.Email,
            PasswordHash = authService.HashPassword(input.Password),
            Role = UserRole.Basic
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        var token = authService.GenerateToken(user);

        return new AuthPayload
        {
            Success = true,
            Token = token,
            User = user
        };
    }

    public async Task<AuthPayload> Login(
        LoginInput input,
        [Service] IDbContextFactory<AppDbContext> dbFactory,
        [Service] IAuthService authService)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == input.Email);
        if (user == null)
        {
            return new AuthPayload
            {
                Success = false,
                Error = "Invalid email or password"
            };
        }

        if (!authService.VerifyPassword(input.Password, user.PasswordHash))
        {
            return new AuthPayload
            {
                Success = false,
                Error = "Invalid email or password"
            };
        }

        var token = authService.GenerateToken(user);

        return new AuthPayload
        {
            Success = true,
            Token = token,
            User = user
        };
    }

    public async Task<Event> CreateEvent(CreateEventInput input, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        var newEvent = new Event
        {
            Title = input.Title,
            Date = input.Date,
            StartTime = input.StartTime,
            EndTime = input.EndTime,
            Description = input.Description
        };
        db.Events.Add(newEvent);
        await db.SaveChangesAsync();
        return newEvent;
    }

    public async Task<Event?> UpdateEvent(int id, Event input, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        var existing = await db.Events.FindAsync(id);
        if (existing is null) return null;
        existing.Title = input.Title;
        existing.Date = input.Date;
        existing.StartTime = input.StartTime;
        existing.EndTime = input.EndTime;
        existing.Description = input.Description;
        await db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteEvent(int id, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        var existing = await db.Events.FindAsync(id);
        if (existing is null) return false;
        db.Events.Remove(existing);
        await db.SaveChangesAsync();
        return true;
    }
}
