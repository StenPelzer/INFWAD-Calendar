using INFWAD.Calendar.Backend.Data;
using INFWAD.Calendar.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace INFWAD.Calendar.Backend.GraphQL;

public class Query
{
    public async Task<IEnumerable<Event>> GetEvents([Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.Events.AsNoTracking().ToListAsync();
    }

    public async Task<Event?> GetEventById(int id, [Service] IDbContextFactory<AppDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();
        return await db.Events.FindAsync(id);
    }
}
