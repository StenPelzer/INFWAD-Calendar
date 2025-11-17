using INFWAD.Calendar.Backend.Data;
using INFWAD.Calendar.Backend.Models;
using Microsoft.EntityFrameworkCore;
using HotChocolate;

namespace INFWAD.Calendar.Backend.GraphQL;

public class Query
{
    [GraphQLName("events")]
    public async Task<IEnumerable<Event>> GetEvents([Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.Events.AsNoTracking().ToListAsync();
    }

    [GraphQLName("event")]
    public async Task<Event?> GetEvent(int id, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.Events.FindAsync(id);
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

    [GraphQLName("roles")]
    public async Task<IEnumerable<Role>> GetRoles([Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.Roles.AsNoTracking().ToListAsync();
    }

    [GraphQLName("role")]
    public async Task<Role?> GetRole(int id, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.Roles.FindAsync(id);
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
        return await db.Users.AsNoTracking().ToListAsync();
    }

    [GraphQLName("user")]
    public async Task<User?> GetUser(int id, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.Users.FindAsync(id);
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
