using Microsoft.EntityFrameworkCore;
using INFWAD.Calendar.Backend.Models;

namespace INFWAD.Calendar.Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Event> Events => Set<Event>();
    public DbSet<EventAttendee> EventAttendees => Set<EventAttendee>();
    public DbSet<Group> Groups => Set<Group>();
    public DbSet<GroupMembership> GroupMemberships => Set<GroupMembership>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<RoomBooking> RoomBookings => Set<RoomBooking>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserOfficeAttendance> UserOfficeAttendances => Set<UserOfficeAttendance>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Event configuration
        modelBuilder.Entity<Event>(eb =>
        {
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Title).IsRequired();
            eb.HasOne(e => e.Room)
              .WithMany(r => r.Events)
              .HasForeignKey(e => e.RoomId)
              .OnDelete(DeleteBehavior.SetNull);
            // Ignore computed property that is not a navigation property
            eb.Ignore(e => e.Attendees);
        });

        // EventAttendee configuration (composite key)
        modelBuilder.Entity<EventAttendee>(eb =>
        {
            eb.HasKey(ea => new { ea.EventId, ea.UserId });
            eb.HasOne(ea => ea.Event)
              .WithMany(e => e.EventAttendees)
              .HasForeignKey(ea => ea.EventId)
              .OnDelete(DeleteBehavior.Cascade);
            eb.HasOne(ea => ea.User)
              .WithMany(u => u.EventAttendees)
              .HasForeignKey(ea => ea.UserId)
              .OnDelete(DeleteBehavior.Cascade);
        });

        // Group configuration
        modelBuilder.Entity<Group>(eb =>
        {
            eb.HasKey(g => g.Id);
            eb.Property(g => g.Name).IsRequired();
            // Ignore computed property that is not a navigation property
            eb.Ignore(g => g.Members);
        });

        // GroupMembership configuration (composite key)
        modelBuilder.Entity<GroupMembership>(eb =>
        {
            eb.HasKey(gm => new { gm.GroupId, gm.UserId });
            eb.HasOne(gm => gm.Group)
              .WithMany(g => g.GroupMemberships)
              .HasForeignKey(gm => gm.GroupId)
              .OnDelete(DeleteBehavior.Cascade);
            eb.HasOne(gm => gm.User)
              .WithMany(u => u.GroupMemberships)
              .HasForeignKey(gm => gm.UserId)
              .OnDelete(DeleteBehavior.Cascade);
        });

        // Room configuration
        modelBuilder.Entity<Room>(eb =>
        {
            eb.HasKey(r => r.Id);
            eb.Property(r => r.Name).IsRequired();
        });

        // RoomBooking configuration
        modelBuilder.Entity<RoomBooking>(eb =>
        {
            eb.HasKey(rb => rb.Id);
            eb.Property(rb => rb.Date).IsRequired();
            eb.Property(rb => rb.StartTime).IsRequired();
            eb.Property(rb => rb.EndTime).IsRequired();
            eb.HasOne(rb => rb.Room)
              .WithMany(r => r.Bookings)
              .HasForeignKey(rb => rb.RoomId)
              .OnDelete(DeleteBehavior.Cascade);
            eb.HasOne(rb => rb.User)
              .WithMany()
              .HasForeignKey(rb => rb.UserId)
              .OnDelete(DeleteBehavior.Cascade);
        });

        // User configuration
        modelBuilder.Entity<User>(eb =>
        {
            eb.HasKey(u => u.Id);
            eb.Property(u => u.Name).IsRequired();
            eb.Property(u => u.Email).IsRequired();
            eb.Property(u => u.Role)
              .IsRequired()
              .HasConversion<int>();
            eb.Property(u => u.PasswordHash).IsRequired();
            // Ignore computed properties that are not navigation properties
            eb.Ignore(u => u.Events);
            eb.Ignore(u => u.Groups);
        });

        // UserOfficeAttendance configuration
        modelBuilder.Entity<UserOfficeAttendance>(eb =>
        {
            eb.HasKey(uoa => uoa.Id);
            eb.Property(uoa => uoa.UserId).IsRequired();
            eb.Property(uoa => uoa.dayOfTheWeek).IsRequired();
            eb.Property(uoa => uoa.StartTime).IsRequired();
            eb.Property(uoa => uoa.EndTime).IsRequired();
            eb.HasOne(uoa => uoa.User)
              .WithMany()
              .HasForeignKey(uoa => uoa.UserId)
              .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
