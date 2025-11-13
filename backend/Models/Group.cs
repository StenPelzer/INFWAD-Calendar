using System.ComponentModel.DataAnnotations;

namespace INFWAD.Calendar.Backend.Models;

public class Group
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }
}
