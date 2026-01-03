using INFWAD.Calendar.Backend.Models;

namespace INFWAD.Calendar.Backend.GraphQL;

public record RegisterInput(
    string Name,
    string Email,
    string Password
);

public record LoginInput(
    string Email,
    string Password
);

public class AuthPayload
{
    public string? Token { get; set; }
    public User? User { get; set; }
    public string? Error { get; set; }
    public bool Success { get; set; }
}

