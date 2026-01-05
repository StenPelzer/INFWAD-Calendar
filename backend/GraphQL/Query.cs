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
            .Include(e => e.Room)
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
            .Include(e => e.Room)
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
        return await db.Rooms.AsNoTracking().FirstOrDefaultAsync(r => r.Id == id);
    }

    [GraphQLName("roomBookings")]
    public async Task<IEnumerable<RoomBooking>> GetRoomBookings([Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.RoomBookings
            .AsNoTracking()
            .Include(rb => rb.Room)
            .Include(rb => rb.User)
            .ToListAsync();
    }

    [GraphQLName("roomBookingsByRoom")]
    public async Task<IEnumerable<RoomBooking>> GetRoomBookingsByRoom(int roomId, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.RoomBookings
            .AsNoTracking()
            .Where(rb => rb.RoomId == roomId)
            .Include(rb => rb.Room)
            .Include(rb => rb.User)
            .ToListAsync();
    }

    [GraphQLName("roomWithBookings")]
    public async Task<Room?> GetRoomWithBookings(int id, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        var room = await db.Rooms.AsNoTracking().FirstOrDefaultAsync(r => r.Id == id);
        return room;
    }

    [GraphQLName("roomsWithBookings")]
    public async Task<IEnumerable<RoomWithBookings>> GetRoomsWithBookings([Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        var rooms = await db.Rooms.AsNoTracking().ToListAsync();
        var bookings = await db.RoomBookings
            .AsNoTracking()
            .Include(rb => rb.User)
            .ToListAsync();

        return rooms.Select(r => new RoomWithBookings
        {
            Id = r.Id,
            Name = r.Name,
            Capacity = r.Capacity,
            Location = r.Location,
            Bookings = bookings.Where(b => b.RoomId == r.Id).ToList()
        });
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
