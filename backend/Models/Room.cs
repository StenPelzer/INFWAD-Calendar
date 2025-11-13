using System.ComponentModel.DataAnnotations;

namespace INFWAD.Calendar.Backend.Models;

public class Room
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public int? Capacity { get; set; }

    public string? Location { get; set; } = string.Empty;
}
