using Microsoft.AspNetCore.Mvc;
using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
  private readonly AppDbContext _context;
  public PessoasController(AppDbContext context) => _context = context;

  [HttpGet] public async Task<IActionResult> Get() => Ok(await _context.Pessoas.ToListAsync());

  [HttpPost]
  public async Task<IActionResult> Post(Pessoa pessoa)
  {
    _context.Pessoas.Add(pessoa);
    await _context.SaveChangesAsync();
    return Ok(pessoa);
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> Put(Guid id, Pessoa p)
  {
    if (id != p.Id) return BadRequest();
    _context.Entry(p).State = EntityState.Modified;
    await _context.SaveChangesAsync();
    return NoContent();
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(Guid id)
  {
    var p = await _context.Pessoas.FindAsync(id);
    if (p == null) return NotFound();
    _context.Pessoas.Remove(p);
    await _context.SaveChangesAsync();
    return NoContent();
  }
}