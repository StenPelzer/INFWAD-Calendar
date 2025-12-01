using System.ComponentModel.DataAnnotations;
using System.Linq;
using HotChocolate;

namespace INFWAD.Calendar.Backend.Models;

public class Event
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public DateOnly Date { get; set; }

    [Required]
    public string StartTime { get; set; } = "00:00";

    [Required]
    public string EndTime { get; set; } = "23:59";

    public string? Description { get; set; }

    [GraphQLIgnore]
    public ICollection<EventAttendee> EventAttendees { get; set; } = new List<EventAttendee>();

    [GraphQLName("attendees")]
    public IEnumerable<User> Attendees => EventAttendees.Select(ea => ea.User);
}
