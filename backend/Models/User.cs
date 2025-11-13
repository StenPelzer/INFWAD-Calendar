using System.ComponentModel.DataAnnotations;

namespace INFWAD.Calendar.Backend.Models;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
