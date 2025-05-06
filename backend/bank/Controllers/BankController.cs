using bank.Data;
using bank.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace bank.Controllers
{
    [Route("api")]
    [ApiController]
    public class BankController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        
        public BankController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<Users>>> GetUsers()
        {
            if(_appDbContext.Users == null)
            {
                return NotFound();
            }

            return await _appDbContext.Users.ToListAsync();
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<Users>> GetUser(int id)
        {
            var user = await _appDbContext.Users.FindAsync(id);
            if(user == null)
            {
                return NotFound();
            }
            return user;
        }
        [HttpPost("users")]
        public async Task<ActionResult<Users>> PostUser(Users user)
        {
            _appDbContext.Add(user);
            await _appDbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPut("users/{id}")]
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
            return (_appDbContext.Users?.Any(user => user.Id == id)).GetValueOrDefault();
        }

        [HttpDelete("users/{id}")]
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


        [HttpGet("accounts")]
        public async Task<ActionResult<IEnumerable<Accounts>>> GetAccounts()
        {
            if (_appDbContext.Accounts == null)
            {
                return NotFound();
            }

            return await _appDbContext.Accounts.ToListAsync();
        }

        [HttpGet("accounts/{id}")]
        public async Task<ActionResult<Accounts>> GetAccount(int id)
        {
            var account = await _appDbContext.Accounts.FindAsync(id);
            if (account == null)
            {
                return NotFound();
            }
            return account;
        }
        [HttpPost("accounts")]
        public async Task<ActionResult<Accounts>> PostAccount(Accounts account)
        {
            _appDbContext.Add(account);
            await _appDbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAccount), new { id = account.id }, account);
        }

        [HttpPut("accounts/{id}")]
        public async Task<ActionResult<Accounts>> PutAccount(int id, Accounts account)
        {
            if (id != account.id)
            {
                return BadRequest();
            }
            _appDbContext.Entry(account).State = EntityState.Modified;
            try
            {
                await _appDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!accountExists(id)) { return NotFound(); }
                else { throw; }
            }
            return NoContent();
        }
        private bool accountExists(long id)
        {
            return (_appDbContext.Accounts?.Any(account => account.id == id)).GetValueOrDefault();
        }

        [HttpDelete("accounts/{id}")]
        public async Task<ActionResult<Accounts>> DeleteAccount(int id)
        {
            var account = await _appDbContext.Accounts.FindAsync(id);
            if (account == null)
            {
                return NotFound();
            }
            _appDbContext.Remove(account);
            await _appDbContext.SaveChangesAsync();
            return NoContent();

        }

        [HttpGet("transactions")]
        public async Task<ActionResult<IEnumerable<Transactions>>> GetTransactions()
        {
            if (_appDbContext.Transactions == null)
            {
                return NotFound();
            }

            return await _appDbContext.Transactions.ToListAsync();
        }

        [HttpGet("transactions/{id}")]
        public async Task<ActionResult<Transactions>> GetTransaction(int id)
        {
            var transaction = await _appDbContext.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }
            return transaction;
        }

        [HttpPost("transactions")]
        public async Task<ActionResult<Transactions>> PostTransaction(Transactions transaction)
        {
            _appDbContext.Add(transaction);
            await _appDbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.id }, transaction);
        }

        [HttpPut("transactions/{id}")]
        public async Task<ActionResult<Transactions>> PutTransacton(int id, Transactions transaction)
        {
            if (id != transaction.id)
            {
                return BadRequest();
            }
            _appDbContext.Entry(transaction).State = EntityState.Modified;
            try
            {
                await _appDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!transactionExists(id)) { return NotFound(); }
                else { throw; }
            }
            return NoContent();
        }
        private bool transactionExists(long id)
        {
            return (_appDbContext.Transactions?.Any(transaction => transaction.id == id)).GetValueOrDefault();
        }

        [HttpDelete("transactions/{id}")]
        public async Task<ActionResult<Transactions>> DeleteTransaction(int id)
        {
            var transaction = await _appDbContext.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }
            _appDbContext.Remove(transaction);
            await _appDbContext.SaveChangesAsync();
            return NoContent();

        }

        //
        [HttpGet("cards")]
        public async Task<ActionResult<IEnumerable<Cards>>> GetCards()
        {
            if (_appDbContext.Cards == null)
            {
                return NotFound();
            }

            return await _appDbContext.Cards.ToListAsync();
        }

        [HttpGet("cards/{id}")]
        public async Task<ActionResult<Cards>> GetCard(int id)
        {
            var card = await _appDbContext.Cards.FindAsync(id);
            if (card == null)
            {
                return NotFound();
            }
            return card;
        }
        [HttpPost("cards")]
        public async Task<ActionResult<Cards>> PostCard(Cards card)
        {
            _appDbContext.Add(card);
            await _appDbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCard), new { id = card.id }, card);
        }

        [HttpPut("cards/{id}")]
        public async Task<ActionResult<Cards>> PutCard(int id, Cards card)
        {
            if (id != card.id)
            {
                return BadRequest();
            }
            _appDbContext.Entry(card).State = EntityState.Modified;
            try
            {
                await _appDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!cardExists(id)) { return NotFound(); }
                else { throw; }
            }
            return NoContent();
        }
        private bool cardExists(long id)
        {
            return (_appDbContext.Cards?.Any(card => card.id == id)).GetValueOrDefault();
        }

        [HttpDelete("cards/{id}")]
        public async Task<ActionResult<Cards>> DeleteCard(int id)
        {
            var card = await _appDbContext.Cards.FindAsync(id);
            if (card == null)
            {
                return NotFound();
            }
            _appDbContext.Remove(card);
            await _appDbContext.SaveChangesAsync();
            return NoContent();

        }
    }
}
