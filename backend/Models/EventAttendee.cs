using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INFWAD.Calendar.Backend.Models;

public class EventAttendee
{
    [Key]
    public int EventId { get; set; }

    [Key]
    public int UserId { get; set; }

    [ForeignKey("EventId")]
    public Event Event { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }
}
