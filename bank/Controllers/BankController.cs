using bank.Data;
using bank.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace bank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BankController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        
        public BankController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Users>>> GetUsers()
        {
            if(_appDbContext.Users == null)
            {
                return NotFound();
            }

            return await _appDbContext.Users.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> GetUser(int id)
        {
            var user = await _appDbContext.Users.FindAsync(id);
            if(user == null)
            {
                return NotFound();
            }
            return user;
        }
        [HttpPost]
        public async Task<ActionResult<Users>> PostUser(Users user)
        {
            _appDbContext.Add(user);
            await _appDbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPut]
        public async Task<ActionResult<Users>> PutUser(int id, Users user)
        {
            if(id != user.Id)
            {
                return BadRequest();
            }
            _appDbContext.Entry(user).State = EntityState.Modified;
            try
            {
                await _appDbContext.SaveChangesAsync();
            }
            catch(DbUpdateConcurrencyException)
            {
                if(!userExists(id)) { return NotFound(); }
                else { throw; }
            }
            return NoContent();
        }
        private bool userExists(long id)
        {
            return (_appDbContext.Users?.Any(movie => movie.Id == id)).GetValueOrDefault();
        }

        [HttpDelete]
        public async Task<ActionResult<Users>> DeleteUser(int id)
        {
            var user = await _appDbContext.Users.FindAsync(id);
            if(user == null)
            {
                return NotFound();
            }
            _appDbContext.Remove(user);
            await _appDbContext.SaveChangesAsync();
            return NoContent();

        }
    }
}
