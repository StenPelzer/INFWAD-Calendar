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

    [Authorize(Roles = new[] { "Admin" })]
    public async Task<Event> CreateEvent(EventInput input, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        int eventId;

        // Create the event
        await using (var db = await dbFactory.CreateDbContextAsync())
        {
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

        // Return the complete event with attendees
        await using (var db = await dbFactory.CreateDbContextAsync())
        {
            return await db.Events
                .AsNoTracking()
                .Include(e => e.EventAttendees)
                    .ThenInclude(ea => ea.User)
                .FirstAsync(e => e.Id == eventId);
        }
    }

    [Authorize(Roles = new[] { "Admin" })]
    public async Task<Event?> UpdateEvent(int id, EventInput input, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
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

        // Return the complete event with attendees
        await using (var db = await dbFactory.CreateDbContextAsync())
        {
            return await db.Events
                .AsNoTracking()
                .Include(e => e.EventAttendees)
                    .ThenInclude(ea => ea.User)
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
}
