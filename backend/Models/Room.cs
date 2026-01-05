using System.ComponentModel.DataAnnotations;
using HotChocolate;

namespace INFWAD.Calendar.Backend.Models;

public class Room
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public int? Capacity { get; set; }

    public string? Location { get; set; } = string.Empty;

    [GraphQLIgnore]
    public ICollection<RoomBooking> Bookings { get; set; } = new List<RoomBooking>();

    [GraphQLIgnore]
    public ICollection<Event> Events { get; set; } = new List<Event>();
}
