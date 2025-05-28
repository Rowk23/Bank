using bank.Data;
using bank.DTO;
using bank.Models;
using bank.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Transactions;

namespace bank.Controllers
{
    [Route("api")]
    [ApiController]
    public class BankController(IAuthService authService, AppDbContext _appDbContext) : ControllerBase
    {

        //Authentication Endpoints
        [HttpPost("register")]
        public async Task<ActionResult<Users>> Register(RegisterDTO request)
        {
            var user = await authService.RegisterAsync(request);
            if (user is null)
                return BadRequest("Username already exists!");

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDTO request)
        {
            var token = await authService.LoginAsync(request);
            if (token is null)
                return BadRequest("Invalid username or password.");

            return Ok(token);
        }

        //Users endpoints

        [HttpGet("users")]
        public async Task<ActionResult<List<Users>>> GetUsers()
        {
            return Ok(await _appDbContext.Users.Include(a=> a.Accounts).ToListAsync());
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<Users>> GetUser(int id)
        {
            var user = await _appDbContext.Users.FindAsync(id);
            if(user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPost("users")]
        public async Task<ActionResult<Users>> PostUser(UserDTO u)
        {
            Users user = new Users();
            user.Username = u.Username; 
            user.Password = u.Password;
            user.Email = u.Email;
            user.First_name = u.First_name;
            user.Last_name = u.Last_name;
            user.Type = u.Type;
            user.CNP = u.CNP;

            _appDbContext.Users.Add(user);
            await _appDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPut("users/{id}")]
        public async Task<ActionResult<Users>> PutUser(int id, UserDTO u)
        {
            var user = await _appDbContext.Users.FindAsync(id);
            if(user == null)
                return NotFound();

            user.Username = u.Username;
            user.Password = u.Password;
            user.Email = u.Email;
            user.First_name =u.First_name;
            user.Last_name=u.Last_name;
            user.Type = u.Type;
            user.CNP = u.CNP;

            await _appDbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("users/{id}")]
        public async Task<ActionResult<Users>> DeleteUser(int id)
        {
            var user = await _appDbContext.Users.FindAsync(id);
            if(user == null)
                return NotFound();

            _appDbContext.Users.Remove(user);
            await _appDbContext.SaveChangesAsync();

            return NoContent();

        }

        [HttpGet("users/profile")]
        public async Task<ActionResult<Users>> GetUserProfile()
        {
            // Extract the user id from JWT claims
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
            if (userIdClaim == null)
                return Unauthorized();

            if (!int.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized();

            var user = await _appDbContext.Users.FindAsync(userId);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        //Accounts endpoints

        [HttpGet("accounts")]
        public async Task<ActionResult<List<Accounts>>> GetAccounts()
        {
            return Ok(await _appDbContext.Accounts
                .Include(t => t.SenderTransactions)
                .Include(t  => t.ReceiverTransactions)
                .Include(c => c.Cards)
                .ToListAsync());
        }

        [HttpGet("accounts/{id}")]
        public async Task<ActionResult<Accounts>> GetAccount(int id)
        {
            var account = await _appDbContext.Accounts.FindAsync(id);
            if (account == null)
                return NotFound();

            return Ok(account);
        }
        [HttpPost("accounts")]
        public async Task<ActionResult<Accounts>> PostAccount(AccountDTO acc)
        {
            Accounts account = new Accounts();
            account.IBAN = acc.IBAN;
            account.UsersId = acc.UsersId;
            account.currency = acc.currency;
            account.balance = acc.balance;

            _appDbContext.Accounts.Add(account);
            await _appDbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAccount), new { id = account.id }, account);
        }

        [HttpPut("accounts/{id}")]
        public async Task<ActionResult<Accounts>> PutAccount(int id, AccountDTO acc)
        {
            var account = await _appDbContext.Accounts.FindAsync(id);
            if (account == null)
                return NotFound();

            account.IBAN = acc.IBAN;
            account.balance = acc.balance;
            account.UsersId = acc.UsersId;
            account.currency = acc.currency;

            await _appDbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("accounts/{id}")]
        public async Task<ActionResult<Accounts>> DeleteAccount(int id)
        {
            var account = await _appDbContext.Accounts.FindAsync(id);
            
            if (account == null)
                return NotFound();

            _appDbContext.Accounts.Remove(account);
            await _appDbContext.SaveChangesAsync();
            
            return NoContent();
        }

        // Transactions Endpoints

        [HttpGet("transactions")]
        public async Task<ActionResult<List<Transactions>>> GetTransactions()
        {
            return Ok(await _appDbContext.Transactions.ToListAsync());
        }

        [HttpGet("transactions/{id}")]
        public async Task<ActionResult<Transactions>> GetTransaction(int id)
        {
            var transaction = await _appDbContext.Transactions.FindAsync(id);
            if (transaction == null)
                return NotFound();

            return Ok(transaction);
        }

        [HttpPost("transactions")]
        public async Task<ActionResult<Transactions>> PostTransaction(TransactionDTO t)
        {
            Transactions transaction = new Transactions();
            transaction.identifier = t.identifier;
            transaction.amount = t.amount;
            transaction.currency = t.currency;
            transaction.time = t.time;
            transaction.type = t.type;
            transaction.FROMid = t.FROMid;
            transaction.TOid = t.TOid;
            transaction.phone = t.phone;


            _appDbContext.Transactions.Add(transaction);
            await _appDbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.id }, transaction);
        }

        [HttpPut("transactions/{id}")]
        public async Task<ActionResult<Transactions>> PutTransacton(int id, TransactionDTO t)
        {
            var transaction = await _appDbContext.Transactions.FindAsync(id);
            if (transaction == null)
                return NotFound();

            transaction.identifier = t.identifier;
            transaction.amount = t.amount;
            transaction.currency = t.currency;
            transaction.time = t.time;
            transaction.type = t.type;
            transaction.FROMid = t.FROMid;
            transaction.TOid = t.TOid;
            transaction.phone = t.phone;

            await _appDbContext.SaveChangesAsync();

            return NoContent();
        }


        [HttpDelete("transactions/{id}")]
        public async Task<ActionResult<Transactions>> DeleteTransaction(int id)
        {
            var transaction = await _appDbContext.Transactions.FindAsync(id);
            
            if (transaction == null)
                return NotFound();

            _appDbContext.Transactions.Remove(transaction);
            await _appDbContext.SaveChangesAsync();
            
            return NoContent();

        }

        //Cards Endpoints


        [HttpGet("cards")]
        public async Task<ActionResult<List<Cards>>> GetCards()
        {
            return Ok(await _appDbContext.Cards.ToListAsync());
        }

        [HttpGet("cards/{id}")]
        public async Task<ActionResult<Cards>> GetCard(int id)
        {
            var card = await _appDbContext.Cards.FindAsync(id);
            if (card == null)
                return NotFound();

            return Ok(card);
        }
        [HttpPost("cards")]
        public async Task<ActionResult<Cards>> PostCard(CardDTO c)
        {
            Cards card = new Cards();
            card.number = c.number;
            card.holderName = c.holderName;
            card.expirationDate = c.expirationDate;
            card.CVV = c.CVV;
            card.AccountsId = c.AccountsId;


            _appDbContext.Cards.Add(card);
            await _appDbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCard), new { id = card.id }, card);
        }

        [HttpPut("cards/{id}")]
        public async Task<ActionResult<Cards>> PutCard(int id, CardDTO c)
        {
            var card = await _appDbContext.Cards.FindAsync(id);
            if (card == null)
                return NotFound();

            card.number = c.number;
            card.holderName = c.holderName;
            card.expirationDate = c.expirationDate;
            card.CVV = c.CVV;
            card.AccountsId = c.AccountsId;

            await _appDbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("cards/{id}")]
        public async Task<ActionResult<Cards>> DeleteCard(int id)
        {
            var card = await _appDbContext.Cards.FindAsync(id);
            
            if (card == null)
                return NotFound();
            
            _appDbContext.Cards.Remove(card);
            await _appDbContext.SaveChangesAsync();
            
            return NoContent();

        }
    }
}
