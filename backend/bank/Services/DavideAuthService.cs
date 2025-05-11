using bank.Data;
using bank.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace bank.Services
{
    public class AuthService(AppDbContext context, IConfiguration configuration) : IAuthService
    {   
        public async Task<string?> LoginAsync(UserDto request)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user is null)
            {
                return null;
            }
            if (new PasswordHasher<Users>().VerifyHashedPassword(user, user.Password, request.Password) == PasswordVerificationResult.Failed)
            {
                return null;
            }
            return CreateToken(user);
        }
        
        private string CreateToken(Users user)
        {
            var claims = new List<Claim>
            {
                new Claim("id", user.Id.ToString()),
                new Claim("role", user.Type)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token")!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
            var tokenDescriptor = new JwtSecurityToken(
                issuer: configuration.GetValue<string>("AppSettings:Issuer"),
                audience: configuration.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }
        
        public async Task<Users?> RegisterAsync(RegisterDTO request)
        {
            if (await context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return null;
            }
            var user = new Users();
            var hashed = new PasswordHasher<Users>().HashPassword(user, request.Password);
            user.Username = request.Username;
            user.Password = hashed;
            user.First_name = request.First_name;
            user.Last_name = request.Last_name;
            user.CNP = request.CNP;
            user.Email = request.Email;
            user.Type = "user";
            context.Add(user);
            context.SaveChangesAsync();
            return user;
        }
    }
}
