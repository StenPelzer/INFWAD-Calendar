using INFWAD.Calendar.Backend.Data;
using INFWAD.Calendar.Backend.Models;
using Microsoft.EntityFrameworkCore;
using HotChocolate;
using System.Security.Claims;

namespace INFWAD.Calendar.Backend.GraphQL;

public class Query
{
    [GraphQLName("me")]
    public async Task<User?> GetMe(
        ClaimsPrincipal? claimsPrincipal,
        [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        if (claimsPrincipal?.Identity?.IsAuthenticated != true)
            return null;

        var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return null;

        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.Users
            .AsNoTracking()
            .Include(u => u.EventAttendees)
            .FirstOrDefaultAsync(u => u.Id == userId);
    }

    [GraphQLName("events")]
    public async Task<IEnumerable<Event>> GetEvents([Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.Events
            .AsNoTracking()
            .Include(e => e.EventAttendees)
                .ThenInclude(ea => ea.User)
            .ToListAsync();
    }

    [GraphQLName("event")]
    public async Task<Event?> GetEvent(int id, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.Events
            .AsNoTracking()
            .Include(e => e.EventAttendees)
                .ThenInclude(ea => ea.User)
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    [GraphQLName("groups")]
    public async Task<IEnumerable<Group>> GetGroups([Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.Groups.AsNoTracking().ToListAsync();
    }

    [GraphQLName("group")]
    public async Task<Group?> GetGroup(int id, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.Groups.FindAsync(id);
    }

    [GraphQLName("rooms")]
    public async Task<IEnumerable<Room>> GetRooms([Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.Rooms.AsNoTracking().ToListAsync();
    }

    [GraphQLName("room")]
    public async Task<Room?> GetRoom(int id, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.Rooms.FindAsync(id);
    }

    [GraphQLName("users")]
    public async Task<IEnumerable<User>> GetUsers([Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.Users.AsNoTracking().Include(u => u.EventAttendees).ToListAsync();
    }

    [GraphQLName("user")]
    public async Task<User?> GetUser(int id, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.Users.AsNoTracking().Include(u => u.EventAttendees).FirstOrDefaultAsync(u => u.Id == id);
    }

    [GraphQLName("userOfficeAttendances")]
    public async Task<IEnumerable<UserOfficeAttendance>> GetUserOfficeAttendances([Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.UserOfficeAttendances.AsNoTracking().ToListAsync();
    }

    [GraphQLName("userOfficeAttendance")]
    public async Task<UserOfficeAttendance?> GetUserOfficeAttendance(int id, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.UserOfficeAttendances.FindAsync(id);
    }
}
