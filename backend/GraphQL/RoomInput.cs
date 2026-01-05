using System.ComponentModel.DataAnnotations;

namespace INFWAD.Calendar.Backend.GraphQL;

public class RoomInput
{
    [Required]
    public string Name { get; set; } = string.Empty;

    public int? Capacity { get; set; }

    public string? Location { get; set; }
}
