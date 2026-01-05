using System.Security.Claims;
using HotChocolate.Authorization;
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

        // Reload user with navigation properties for GraphQL serialization
        await using var readDb = await dbFactory.CreateDbContextAsync();
        var userWithNav = await readDb.Users
            .AsNoTracking()
            .Include(u => u.EventAttendees)
                .ThenInclude(ea => ea.Event)
            .Include(u => u.GroupMemberships)
                .ThenInclude(gm => gm.Group)
            .FirstAsync(u => u.Id == user.Id);

        var token = authService.GenerateToken(userWithNav);

        return new AuthPayload
        {
            Success = true,
            Token = token,
            User = userWithNav
        };
    }

    public async Task<AuthPayload> Login(
        LoginInput input,
        [Service] IDbContextFactory<AppDbContext> dbFactory,
        [Service] IAuthService authService)
    {
        await using var db = await dbFactory.CreateDbContextAsync();

        var user = await db.Users
            .AsNoTracking()
            .Include(u => u.EventAttendees)
                .ThenInclude(ea => ea.Event)
            .Include(u => u.GroupMemberships)
                .ThenInclude(gm => gm.Group)
            .FirstOrDefaultAsync(u => u.Email == input.Email);
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

    [Authorize(Roles = new[] { "Admin" })]
    public async Task<Event> CreateEvent(EventInput input, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        int eventId;

        // Check room availability if a room is specified
        if (input.RoomId.HasValue)
        {
            await using var checkDb = await dbFactory.CreateDbContextAsync();
            var conflict = await CheckRoomAvailabilityForEvent(checkDb, input.RoomId.Value, input.Date, input.StartTime, input.EndTime, null);
            if (conflict)
            {
                throw new GraphQLException("The selected room is not available at the requested time");
            }
        }

        // Create the event
        await using (var db = await dbFactory.CreateDbContextAsync())
        {
            var newEvent = new Event
            {
                Title = input.Title,
                Date = input.Date,
                StartTime = input.StartTime,
                EndTime = input.EndTime,
                Description = input.Description,
                RoomId = input.RoomId
            };
            db.Events.Add(newEvent);
            await db.SaveChangesAsync();
            eventId = newEvent.Id;
        }

        // Add attendees with change tracking disabled to avoid NavigationFixer issues
        if (input.AttendeeIds != null && input.AttendeeIds.Count > 0)
        {
            await using var db = await dbFactory.CreateDbContextAsync();

            // Verify users exist
            var existingUserIds = await db.Users
                .Where(u => input.AttendeeIds.Contains(u.Id))
                .Select(u => u.Id)
                .ToListAsync();

            // Disable auto-detect changes to prevent NavigationFixer from running (composite key issue)
            db.ChangeTracker.AutoDetectChangesEnabled = false;

            foreach (var userId in existingUserIds)
            {
                db.EventAttendees.Add(new EventAttendee
                {
                    EventId = eventId,
                    UserId = userId
                });
            }

            await db.SaveChangesAsync();
        }

        // Return the complete event with attendees and room
        await using (var db = await dbFactory.CreateDbContextAsync())
        {
            return await db.Events
                .AsNoTracking()
                .Include(e => e.EventAttendees)
                    .ThenInclude(ea => ea.User)
                .Include(e => e.Room)
                .FirstAsync(e => e.Id == eventId);
        }
    }

    [Authorize(Roles = new[] { "Admin" })]
    public async Task<Event?> UpdateEvent(int id, EventInput input, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        // Check room availability if a room is specified
        if (input.RoomId.HasValue)
        {
            await using var checkDb = await dbFactory.CreateDbContextAsync();
            var conflict = await CheckRoomAvailabilityForEvent(checkDb, input.RoomId.Value, input.Date, input.StartTime, input.EndTime, id);
            if (conflict)
            {
                throw new GraphQLException("The selected room is not available at the requested time");
            }
        }

        // Update event properties
        await using (var db = await dbFactory.CreateDbContextAsync())
        {
            var existing = await db.Events.FindAsync(id);
            if (existing is null) return null;
            
            existing.Title = input.Title;
            existing.Date = input.Date;
            existing.StartTime = input.StartTime;
            existing.EndTime = input.EndTime;
            existing.Description = input.Description;
            existing.RoomId = input.RoomId;
            await db.SaveChangesAsync();
        }

        // Update attendees - remove old ones
        await using (var db = await dbFactory.CreateDbContextAsync())
        {
            // Get current attendees
            var currentAttendees = await db.EventAttendees
                .Where(ea => ea.EventId == id)
                .ToListAsync();

            var newAttendeeIds = input.AttendeeIds ?? new List<int>();

            // Remove attendees that are no longer in the list
            var attendeesToRemove = currentAttendees
                .Where(ea => !newAttendeeIds.Contains(ea.UserId))
                .ToList();

            db.EventAttendees.RemoveRange(attendeesToRemove);
            await db.SaveChangesAsync();
        }

        // Update attendees - add new ones
        if (input.AttendeeIds != null && input.AttendeeIds.Count > 0)
        {
            await using var db = await dbFactory.CreateDbContextAsync();

            // Get current attendee IDs after removal
            var currentAttendeeIds = await db.EventAttendees
                .Where(ea => ea.EventId == id)
                .Select(ea => ea.UserId)
                .ToListAsync();

            // Verify new users exist
            var existingUserIds = await db.Users
                .Where(u => input.AttendeeIds.Contains(u.Id))
                .Select(u => u.Id)
                .ToListAsync();

            // Disable auto-detect changes to prevent NavigationFixer issues
            db.ChangeTracker.AutoDetectChangesEnabled = false;

            foreach (var userId in existingUserIds)
            {
                if (!currentAttendeeIds.Contains(userId))
                {
                    db.EventAttendees.Add(new EventAttendee
                    {
                        EventId = id,
                        UserId = userId
                    });
                }
            }

            await db.SaveChangesAsync();
        }

        // Return the complete event with attendees and room
        await using (var db = await dbFactory.CreateDbContextAsync())
        {
            return await db.Events
                .AsNoTracking()
                .Include(e => e.EventAttendees)
                    .ThenInclude(ea => ea.User)
                .Include(e => e.Room)
                .FirstAsync(e => e.Id == id);
        }
    }

    [Authorize(Roles = new[] { "Admin" })]
    public async Task<bool> DeleteEvent(int id, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        var existing = await db.Events.FindAsync(id);
        if (existing is null) return false;
        db.Events.Remove(existing);
        await db.SaveChangesAsync();
        return true;
    }

    [Authorize]
    public async Task<Event?> JoinEvent(
        int eventId,
        ClaimsPrincipal claimsPrincipal,
        [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        // Get user ID from JWT claims (ASP.NET Core maps "sub" to NameIdentifier)
        var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? claimsPrincipal.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            throw new GraphQLException("Unable to identify user from token");
        }

        await using var db = await dbFactory.CreateDbContextAsync();

        // Verify event exists
        var eventExists = await db.Events.AnyAsync(e => e.Id == eventId);
        if (!eventExists)
        {
            throw new GraphQLException("Event not found");
        }

        // Check if already attending
        var alreadyAttending = await db.EventAttendees
            .AnyAsync(ea => ea.EventId == eventId && ea.UserId == userId);
        
        if (alreadyAttending)
        {
            // Already attending, just return the event
            return await db.Events
                .AsNoTracking()
                .Include(e => e.EventAttendees)
                    .ThenInclude(ea => ea.User)
                .Include(e => e.Room)
                .FirstAsync(e => e.Id == eventId);
        }

        // Disable auto-detect changes to prevent NavigationFixer issues
        db.ChangeTracker.AutoDetectChangesEnabled = false;

        db.EventAttendees.Add(new EventAttendee
        {
            EventId = eventId,
            UserId = userId
        });

        await db.SaveChangesAsync();

        // Return the updated event
        await using var readDb = await dbFactory.CreateDbContextAsync();
        return await readDb.Events
            .AsNoTracking()
            .Include(e => e.EventAttendees)
                .ThenInclude(ea => ea.User)
            .Include(e => e.Room)
            .FirstAsync(e => e.Id == eventId);
    }

    [Authorize]
    public async Task<Event?> LeaveEvent(
        int eventId,
        ClaimsPrincipal claimsPrincipal,
        [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        // Get user ID from JWT claims (ASP.NET Core maps "sub" to NameIdentifier)
        var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? claimsPrincipal.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            throw new GraphQLException("Unable to identify user from token");
        }

        await using var db = await dbFactory.CreateDbContextAsync();

        // Find the attendance record
        var attendance = await db.EventAttendees
            .FirstOrDefaultAsync(ea => ea.EventId == eventId && ea.UserId == userId);
        
        if (attendance == null)
        {
            // Not attending, just return the event
            var evt = await db.Events
                .AsNoTracking()
                .Include(e => e.EventAttendees)
                    .ThenInclude(ea => ea.User)
                .Include(e => e.Room)
                .FirstOrDefaultAsync(e => e.Id == eventId);
            
            if (evt == null)
            {
                throw new GraphQLException("Event not found");
            }
            return evt;
        }

        db.EventAttendees.Remove(attendance);
        await db.SaveChangesAsync();

        // Return the updated event
        await using var readDb = await dbFactory.CreateDbContextAsync();
        return await readDb.Events
            .AsNoTracking()
            .Include(e => e.EventAttendees)
                .ThenInclude(ea => ea.User)
            .Include(e => e.Room)
            .FirstAsync(e => e.Id == eventId);
    }

    // ==================== Room Mutations ====================

    [Authorize(Roles = new[] { "Admin" })]
    public async Task<Room> CreateRoom(RoomInput input, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        
        var room = new Room
        {
            Name = input.Name,
            Capacity = input.Capacity,
            Location = input.Location
        };

        db.Rooms.Add(room);
        await db.SaveChangesAsync();
        
        return room;
    }

    [Authorize(Roles = new[] { "Admin" })]
    public async Task<Room?> UpdateRoom(int id, RoomInput input, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        
        var room = await db.Rooms.FindAsync(id);
        if (room == null) return null;

        room.Name = input.Name;
        room.Capacity = input.Capacity;
        room.Location = input.Location;

        await db.SaveChangesAsync();
        return room;
    }

    [Authorize(Roles = new[] { "Admin" })]
    public async Task<bool> DeleteRoom(int id, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        
        var room = await db.Rooms.FindAsync(id);
        if (room == null) return false;

        db.Rooms.Remove(room);
        await db.SaveChangesAsync();
        return true;
    }

    // ==================== Room Booking Mutations ====================

    [Authorize]
    public async Task<RoomBooking> BookRoom(
        RoomBookingInput input,
        ClaimsPrincipal claimsPrincipal,
        [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? claimsPrincipal.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            throw new GraphQLException("Unable to identify user from token");
        }

        await using var db = await dbFactory.CreateDbContextAsync();

        // Check if room exists
        var room = await db.Rooms.FindAsync(input.RoomId);
        if (room == null)
        {
            throw new GraphQLException("Room not found");
        }

        // Check for conflicting bookings
        var conflict = await CheckRoomAvailability(db, input.RoomId, input.Date, input.StartTime, input.EndTime, null);
        if (conflict)
        {
            throw new GraphQLException("Room is not available at the requested time");
        }

        var booking = new RoomBooking
        {
            RoomId = input.RoomId,
            UserId = userId,
            Date = input.Date,
            StartTime = input.StartTime,
            EndTime = input.EndTime,
            Title = input.Title
        };

        db.RoomBookings.Add(booking);
        await db.SaveChangesAsync();

        // Return with includes
        await using var readDb = await dbFactory.CreateDbContextAsync();
        return await readDb.RoomBookings
            .AsNoTracking()
            .Include(rb => rb.Room)
            .Include(rb => rb.User)
            .FirstAsync(rb => rb.Id == booking.Id);
    }

    [Authorize]
    public async Task<bool> CancelRoomBooking(
        int bookingId,
        ClaimsPrincipal claimsPrincipal,
        [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? claimsPrincipal.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            throw new GraphQLException("Unable to identify user from token");
        }

        // Check if user is admin
        var isAdmin = claimsPrincipal.IsInRole("Admin");

        await using var db = await dbFactory.CreateDbContextAsync();
        
        var booking = await db.RoomBookings.FindAsync(bookingId);
        if (booking == null)
        {
            throw new GraphQLException("Booking not found");
        }

        // Only the booking owner or admin can cancel
        if (booking.UserId != userId && !isAdmin)
        {
            throw new GraphQLException("You can only cancel your own bookings");
        }

        db.RoomBookings.Remove(booking);
        await db.SaveChangesAsync();
        return true;
    }

    // Helper method to check room availability
    private static async Task<bool> CheckRoomAvailability(
        AppDbContext db,
        int roomId,
        DateOnly date,
        string startTime,
        string endTime,
        int? excludeBookingId)
    {
        var bookings = await db.RoomBookings
            .Where(rb => rb.RoomId == roomId && rb.Date == date)
            .ToListAsync();

        foreach (var booking in bookings)
        {
            if (excludeBookingId.HasValue && booking.Id == excludeBookingId.Value)
                continue;

            // Check for time overlap
            if (TimesOverlap(startTime, endTime, booking.StartTime, booking.EndTime))
            {
                return true; // Conflict exists
            }
        }

        return false; // No conflict
    }

    private static bool TimesOverlap(string start1, string end1, string start2, string end2)
    {
        // Parse times as TimeSpan for comparison
        var s1 = TimeSpan.Parse(start1);
        var e1 = TimeSpan.Parse(end1);
        var s2 = TimeSpan.Parse(start2);
        var e2 = TimeSpan.Parse(end2);

        // Overlap occurs if one starts before the other ends
        return s1 < e2 && s2 < e1;
    }

    // Helper method to check room availability for events (checks both bookings and other events)
    private static async Task<bool> CheckRoomAvailabilityForEvent(
        AppDbContext db,
        int roomId,
        DateOnly date,
        string startTime,
        string endTime,
        int? excludeEventId)
    {
        // Check room bookings
        var bookings = await db.RoomBookings
            .Where(rb => rb.RoomId == roomId && rb.Date == date)
            .ToListAsync();

        foreach (var booking in bookings)
        {
            if (TimesOverlap(startTime, endTime, booking.StartTime, booking.EndTime))
            {
                return true; // Conflict with booking
            }
        }

        // Check other events using this room
        var events = await db.Events
            .Where(e => e.RoomId == roomId && e.Date == date)
            .ToListAsync();

        foreach (var evt in events)
        {
            if (excludeEventId.HasValue && evt.Id == excludeEventId.Value)
                continue;

            if (TimesOverlap(startTime, endTime, evt.StartTime, evt.EndTime))
            {
                return true; // Conflict with another event
            }
        }

        return false; // No conflict
    }
}
