using System.ComponentModel.DataAnnotations;

namespace INFWAD.Calendar.Backend.Models;

public class Group
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    [GraphQLIgnore]
    public ICollection<GroupMembership> GroupMemberships { get; set; } = new List<GroupMembership>();

    [GraphQLName("members")]
    public IEnumerable<User> Members => GroupMemberships.Select(gm => gm.User);
}
