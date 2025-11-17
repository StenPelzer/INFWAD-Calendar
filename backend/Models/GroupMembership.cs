using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INFWAD.Calendar.Backend.Models;

public class GroupMembership
{
    [Key]
    public int GroupId { get; set; }

    [Key]
    public int UserId { get; set; }

    [ForeignKey("GroupId")]
    public Group Group { get; set; } = null!;

    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
}
