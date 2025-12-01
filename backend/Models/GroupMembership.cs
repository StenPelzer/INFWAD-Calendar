namespace INFWAD.Calendar.Backend.Models;

public class GroupMembership
{
    public int GroupId { get; set; }
    public int UserId { get; set; }

    public Group Group { get; set; } = null!;
    public User User { get; set; } = null!;
}
