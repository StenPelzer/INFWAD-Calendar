using System.ComponentModel.DataAnnotations;

namespace INFWAD.Calendar.Backend.GraphQL;

public class RoomBookingInput
{
    [Required]
    public int RoomId { get; set; }

    [Required]
    public DateOnly Date { get; set; }

    [Required]
    public string StartTime { get; set; } = "00:00";

    [Required]
    public string EndTime { get; set; } = "23:59";

    public string? Title { get; set; }
}
