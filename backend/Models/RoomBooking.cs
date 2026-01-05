using System.ComponentModel.DataAnnotations;

namespace INFWAD.Calendar.Backend.Models;

public class RoomBooking
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int RoomId { get; set; }

    public Room Room { get; set; } = null!;

    [Required]
    public int UserId { get; set; }

    public User User { get; set; } = null!;

    [Required]
    public DateOnly Date { get; set; }

    [Required]
    public string StartTime { get; set; } = "00:00";

    [Required]
    public string EndTime { get; set; } = "23:59";

    public string? Title { get; set; }
}

