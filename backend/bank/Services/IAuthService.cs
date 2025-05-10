using bank.Models;

namespace bank.Services
{
    public interface IAuthService
    {
        Task<Users?> RegisterAsync(RegisterDTO request);
        Task<string?> LoginAsync(UserDto request);
    }
}
