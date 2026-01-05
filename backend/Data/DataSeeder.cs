using Microsoft.EntityFrameworkCore;
using INFWAD.Calendar.Backend.Models;
using INFWAD.Calendar.Backend.Services;

namespace INFWAD.Calendar.Backend.Data;

public class DataSeeder
{
    private readonly AppDbContext _context;
    private readonly IAuthService _authService;

    public DataSeeder(AppDbContext context, IAuthService authService)
    {
        _context = context;
        _authService = authService;
    }

    public async Task SeedAsync()
    {
        // Ensure database is created
        await _context.Database.EnsureCreatedAsync();

        // Check if data already exists
        if (await _context.Users.AnyAsync())
        {
            Console.WriteLine("Database already contains data. Skipping seed.");
            return;
        }

        Console.WriteLine("Starting database seed...");

        // Seed Users
        var adminUser = new User
        {
            Name = "Sten Pelzer",
            Email = "admin@infwad.nl",
            Role = UserRole.Admin,
            PasswordHash = _authService.HashPassword("admin123"),
            Color = "#FF5733"
        };

        var mainBasicUser = new User
        {
            Name = "Steven Koerts",
            Email = "basic@infwad.nl",
            Role = UserRole.Basic,
            PasswordHash = _authService.HashPassword("basic123"),
            Color = "#33C3F0"
        };

        var additionalUsers = new List<User>
        {
            new User { Name = "Annie Kuijpers", Email = "annie@infwad.nl", Role = UserRole.Basic, PasswordHash = _authService.HashPassword("basic123"), Color = "#9B59B6" },
            new User { Name = "Bram Geelen", Email = "bram@infwad.nl", Role = UserRole.Basic, PasswordHash = _authService.HashPassword("basic123"), Color = "#E74C3C" },
            new User { Name = "Joris Haakma", Email = "joris@infwad.nl", Role = UserRole.Basic, PasswordHash = _authService.HashPassword("basic123"), Color = "#F39C12" },
            new User { Name = "John Pieters", Email = "john@infwad.nl", Role = UserRole.Basic, PasswordHash = _authService.HashPassword("basic123"), Color = "#1ABC9C" },
            new User { Name = "Maurice Gallen", Email = "maurice@infwad.nl", Role = UserRole.Basic, PasswordHash = _authService.HashPassword("basic123"), Color = "#3498DB" },
            new User { Name = "Ruud Berends", Email = "ruud@infwad.nl", Role = UserRole.Basic, PasswordHash = _authService.HashPassword("basic123"), Color = "#E67E22" },
            new User { Name = "Bart Meijer", Email = "bart@infwad.nl", Role = UserRole.Basic, PasswordHash = _authService.HashPassword("basic123"), Color = "#2ECC71" },
            new User { Name = "Jeroen ten Have", Email = "jeroen@infwad.nl", Role = UserRole.Basic, PasswordHash = _authService.HashPassword("basic123"), Color = "#95A5A6" }
        };

        _context.Users.Add(adminUser);
        _context.Users.Add(mainBasicUser);
        _context.Users.AddRange(additionalUsers);
        await _context.SaveChangesAsync();

        Console.WriteLine($"Seeded {additionalUsers.Count + 2} users");

        // Seed Rooms
        var rooms = new List<Room>
        {
            new Room
            {
                Name = "Conference Room A",
                Capacity = 20,
                Location = "First Floor"
            },
            new Room
            {
                Name = "Meeting Room B",
                Capacity = 10,
                Location = "Second Floor"
            },
            new Room
            {
                Name = "Boardroom",
                Capacity = 15,
                Location = "First Floor"
            }
        };

        _context.Rooms.AddRange(rooms);
        await _context.SaveChangesAsync();

        Console.WriteLine($"Seeded {rooms.Count} rooms");

        // Seed Events
        var allUsers = await _context.Users.ToListAsync();
        var allRooms = await _context.Rooms.ToListAsync();

        var events = new List<Event>
        {
            new Event
            {
                Title = "Team Standup",
                Date = DateOnly.FromDateTime(DateTime.Today.AddDays(1)),
                StartTime = "09:00",
                EndTime = "09:30",
                Description = "Daily team standup meeting",
                RoomId = allRooms[0].Id
            },
            new Event
            {
                Title = "Project Planning",
                Date = DateOnly.FromDateTime(DateTime.Today.AddDays(2)),
                StartTime = "14:00",
                EndTime = "16:00",
                Description = "Quarterly project planning session",
                RoomId = allRooms[1].Id
            },
            new Event
            {
                Title = "Client Presentation",
                Date = DateOnly.FromDateTime(DateTime.Today.AddDays(3)),
                StartTime = "10:00",
                EndTime = "11:30",
                Description = "Presenting new features to client",
                RoomId = allRooms[2].Id
            },
            new Event
            {
                Title = "Code Review",
                Date = DateOnly.FromDateTime(DateTime.Today.AddDays(1)),
                StartTime = "15:00",
                EndTime = "16:00",
                Description = "Weekly code review session",
                RoomId = null
            }
        };

        _context.Events.AddRange(events);
        await _context.SaveChangesAsync();

        // Add attendees to events
        var eventAttendees = new List<EventAttendee>
        {
            // Team Standup
            new EventAttendee { EventId = events[0].Id, UserId = adminUser.Id },
            new EventAttendee { EventId = events[0].Id, UserId = mainBasicUser.Id },
            new EventAttendee { EventId = events[0].Id, UserId = allUsers[2].Id },
            new EventAttendee { EventId = events[0].Id, UserId = allUsers[3].Id },

            // Project Planning
            new EventAttendee { EventId = events[1].Id, UserId = adminUser.Id },
            new EventAttendee { EventId = events[1].Id, UserId = allUsers[2].Id },
            new EventAttendee { EventId = events[1].Id, UserId = allUsers[4].Id },
            new EventAttendee { EventId = events[1].Id, UserId = allUsers[5].Id },

            // Client Presentation
            new EventAttendee { EventId = events[2].Id, UserId = adminUser.Id },
            new EventAttendee { EventId = events[2].Id, UserId = mainBasicUser.Id },
            new EventAttendee { EventId = events[2].Id, UserId = allUsers[6].Id },

            // Code Review
            new EventAttendee { EventId = events[3].Id, UserId = mainBasicUser.Id },
            new EventAttendee { EventId = events[3].Id, UserId = allUsers[2].Id },
            new EventAttendee { EventId = events[3].Id, UserId = allUsers[3].Id }
        };

        _context.EventAttendees.AddRange(eventAttendees);
        await _context.SaveChangesAsync();

        Console.WriteLine($"Seeded {events.Count} events with attendees");

        // Seed Room Bookings
        var random = new Random();
        var roomBookings = new List<RoomBooking>();

        // Create some room bookings for the next 2 weeks
        for (int dayOffset = 0; dayOffset < 14; dayOffset++)
        {
            var date = DateOnly.FromDateTime(DateTime.Today.AddDays(dayOffset));

            // Skip weekends (Saturday = 6, Sunday = 0)
            if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                continue;

            // Create 1-3 random bookings per day
            int bookingsPerDay = random.Next(1, 4);

            for (int i = 0; i < bookingsPerDay; i++)
            {
                var randomUser = allUsers[random.Next(allUsers.Count)];
                var randomRoom = allRooms[random.Next(allRooms.Count)];

                // Random time slots during business hours (8:00 - 18:00)
                int startHour = random.Next(8, 17);
                int startMinute = random.Next(0, 2) * 30; // 0 or 30
                int duration = random.Next(1, 4); // 1-3 hours
                int endHour = startHour + duration;
                int endMinute = startMinute;

                if (endHour >= 18)
                {
                    endHour = 17;
                    endMinute = 30;
                }

                var startTime = $"{startHour:D2}:{startMinute:D2}";
                var endTime = $"{endHour:D2}:{endMinute:D2}";

                var titles = new[]
                {
                    "Team Meeting",
                    "Client Call",
                    "Workshop",
                    "Training Session",
                    "Planning Meeting",
                    "Review Session",
                    "Brainstorming",
                    "One-on-One"
                };

                roomBookings.Add(new RoomBooking
                {
                    RoomId = randomRoom.Id,
                    UserId = randomUser.Id,
                    Date = date,
                    StartTime = startTime,
                    EndTime = endTime,
                    Title = titles[random.Next(titles.Length)]
                });
            }
        }

        _context.RoomBookings.AddRange(roomBookings);
        await _context.SaveChangesAsync();

        Console.WriteLine($"Seeded {roomBookings.Count} room bookings");
        Console.WriteLine("Database seeding completed successfully!");
    }
}
