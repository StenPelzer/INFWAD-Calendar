using System.ComponentModel.DataAnnotations;

namespace INFWAD.Calendar.Backend.GraphQL;

public class CreateEventInput
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public DateOnly Date { get; set; }

    [Required]
    public string StartTime { get; set; } = "00:00";

    [Required]
    public string EndTime { get; set; } = "23:59";

    public string? Description { get; set; }
}
