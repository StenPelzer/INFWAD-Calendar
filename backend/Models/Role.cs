using System.ComponentModel.DataAnnotations;

namespace INFWAD.Calendar.Backend.Models;

public class Role
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;
}
