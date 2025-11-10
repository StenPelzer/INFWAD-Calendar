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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Event>(eb =>
        {
            eb.HasKey(e => e.Id);
            eb.Property(e => e.Title).IsRequired();
        });
    }
}
