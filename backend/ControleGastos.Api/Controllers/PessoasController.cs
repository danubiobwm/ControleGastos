using Microsoft.AspNetCore.Mvc;
using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using ControleGastos.Api.DTOs;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
  private readonly AppDbContext _context;
  public PessoasController(AppDbContext context) => _context = context;

  [HttpGet]
  public async Task<IActionResult> Get() => Ok(await _context.Pessoas.ToListAsync());

  [HttpPost]
  public async Task<IActionResult> Post(PessoaRequest request)
  {
    var pessoa = new Pessoa { Nome = request.Nome, Idade = request.Idade };
    _context.Pessoas.Add(pessoa);
    await _context.SaveChangesAsync();
    return Ok(pessoa);
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(Guid id)
  {
    var p = await _context.Pessoas.Include(x => x.Transacoes).FirstOrDefaultAsync(x => x.Id == id);
    if (p == null) return NotFound();

    _context.Pessoas.Remove(p);
    await _context.SaveChangesAsync();
    return NoContent();
  }
}