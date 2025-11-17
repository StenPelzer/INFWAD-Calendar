using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INFWAD.Calendar.Backend.Models;

public class UserOfficeAttendance
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public string dayOfTheWeek { get; set; } = string.Empty;

    [Required]
    public string StartTime { get; set; } = "00:00";

    [Required]
    public string EndTime { get; set; } = "23:59";

    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
}
