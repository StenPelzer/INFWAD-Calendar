using INFWAD.Calendar.Backend.Data;
using INFWAD.Calendar.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace INFWAD.Calendar.Backend.GraphQL;

public class Mutation
{
    public async Task<Event> CreateEvent(Event input, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        db.Events.Add(input);
        await db.SaveChangesAsync();
        return input;
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
