using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using ControleGastos.Api.DTOs;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
  private readonly AppDbContext _context;

  public PessoasController(AppDbContext context)
  {
    _context = context;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<Pessoa>>> Get()
  {
    return await _context.Pessoas.ToListAsync();
  }

  [HttpPost]
  public async Task<ActionResult<Pessoa>> Post(PessoaRequest request)
  {
    var pessoa = new Pessoa
    {
      Nome = request.Nome,
      Idade = request.Idade
    };

    _context.Pessoas.Add(pessoa);
    await _context.SaveChangesAsync();
    return CreatedAtAction(nameof(Get), new { id = pessoa.Id }, pessoa);
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> Put(Guid id, [FromBody] PessoaRequest request)
  {
    var pessoaExistente = await _context.Pessoas.FindAsync(id);

    if (pessoaExistente == null)
      return NotFound(new { message = "Pessoa não encontrada." });

    pessoaExistente.Nome = request.Nome;
    pessoaExistente.Idade = request.Idade;

    try
    {
      await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
      if (!PessoaExists(id)) return NotFound();
      else throw;
    }

    return Ok(pessoaExistente);
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(Guid id)
  {
    var pessoa = await _context.Pessoas.FindAsync(id);
    if (pessoa == null) return NotFound();

    _context.Pessoas.Remove(pessoa);
    await _context.SaveChangesAsync();

    return NoContent();
  }

  private bool PessoaExists(Guid id) => _context.Pessoas.Any(e => e.Id == id);

  [HttpGet("totais")]
  public async Task<ActionResult<ConsultaTotaisResponse>> GetTotais()
  {
    var pessoas = await _context.Pessoas
        .Include(p => p.Transacoes)
        .ToListAsync();

    var detalhes = pessoas.Select(p =>
    {
      var receitas = p.Transacoes
          .Where(t => t.Tipo.ToLower() == "receita")
          .Sum(t => t.Valor);

      var despesas = p.Transacoes
          .Where(t => t.Tipo.ToLower() == "despesa")
          .Sum(t => t.Valor);

      return new PessoaTotalItem(
          p.Nome,
          receitas,
          despesas,
          receitas - despesas
      );
    }).ToList();

    var totalReceitas = detalhes.Sum(d => d.TotalReceitas);
    var totalDespesas = detalhes.Sum(d => d.TotalDespesas);
    var saldoLiquido = totalReceitas - totalDespesas;

    var resposta = new ConsultaTotaisResponse(
        detalhes,
        totalReceitas,
        totalDespesas,
        saldoLiquido
    );

    return Ok(resposta);
  }
}
