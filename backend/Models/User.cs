using System.ComponentModel.DataAnnotations;
using System.Linq;
using HotChocolate;

namespace INFWAD.Calendar.Backend.Models;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    public string? Color { get; set; }

    [GraphQLIgnore]
    public ICollection<EventAttendee> EventAttendees { get; set; } = new List<EventAttendee>();

    [GraphQLName("events")]
    public IEnumerable<Event> Events => EventAttendees.Select(ea => ea.Event);

    [GraphQLIgnore]
    public ICollection<GroupMembership> GroupMemberships { get; set; } = new List<GroupMembership>();

    [GraphQLName("groups")]
    public IEnumerable<Group> Groups => GroupMemberships.Select(gm => gm.Group);
}
