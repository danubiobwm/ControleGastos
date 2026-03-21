using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using ControleGastos.Api.DTOs;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
  private readonly AppDbContext _context;

  public CategoriasController(AppDbContext context)
  {
    _context = context;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<Categoria>>> Get()
  {
    return await _context.Categorias.ToListAsync();
  }

  [HttpPost]
  public async Task<ActionResult<Categoria>> Post(CategoriaRequest request)
  {
    var finalidadeValida = request.Finalidade.ToLower();
    if (finalidadeValida != "despesa" && finalidadeValida != "receita" && finalidadeValida != "ambas")
    {
      return BadRequest(new { message = "Finalidade deve ser: despesa, receita ou ambas." });
    }

    var categoria = new Categoria
    {
      Descricao = request.Descricao,
      Finalidade = request.Finalidade
    };

    _context.Categorias.Add(categoria);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(Get), new { id = categoria.Id }, categoria);
  }
  [HttpGet("totais")]
  public async Task<ActionResult<ConsultaTotaisCategoriaResponse>> GetTotais()
  {
    var categorias = await _context.Categorias.ToListAsync();
    var todasTransacoes = await _context.Transacoes.ToListAsync();

    var detalhes = categorias.Select(c =>
    {
      var transacoesDaCategoria = todasTransacoes.Where(t => t.CategoriaId == c.Id);

      var receitas = transacoesDaCategoria
          .Where(t => t.Tipo.ToLower() == "receita")
          .Sum(t => t.Valor);

      var despesas = transacoesDaCategoria
          .Where(t => t.Tipo.ToLower() == "despesa")
          .Sum(t => t.Valor);

      return new CategoriaTotalItem(
          c.Descricao,
          receitas,
          despesas,
          receitas - despesas
      );
    }).ToList();

    var totalReceitas = detalhes.Sum(d => d.TotalReceitas);
    var totalDespesas = detalhes.Sum(d => d.TotalDespesas);
    var saldoLiquido = totalReceitas - totalDespesas;

    var resposta = new ConsultaTotaisCategoriaResponse(
        detalhes,
        totalReceitas,
        totalDespesas,
        saldoLiquido
    );

    return Ok(resposta);
  }
  [HttpPut("{id}")]
  public async Task<IActionResult> Put(Guid id, CategoriaRequest request)
  {
    var categoria = await _context.Categorias.FindAsync(id);

    if (categoria == null)
    {
      return NotFound(new { message = "Categoria não encontrada." });
    }

    var finalidadeValida = request.Finalidade.ToLower();
    if (finalidadeValida != "despesa" && finalidadeValida != "receita" && finalidadeValida != "ambas")
    {
      return BadRequest(new { message = "Finalidade deve ser: despesa, receita ou ambas." });
    }

    categoria.Descricao = request.Descricao;
    categoria.Finalidade = request.Finalidade;

    try
    {
      await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
      if (!CategoriaExists(id)) return NotFound();
      else throw;
    }

    return NoContent();
  }

  // 5. Deletar Categoria
  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(Guid id)
  {
    var categoria = await _context.Categorias.FindAsync(id);
    if (categoria == null)
    {
      return NotFound(new { message = "Categoria não encontrada." });
    }

    var temTransacoes = await _context.Transacoes.AnyAsync(t => t.CategoriaId == id);
    if (temTransacoes)
    {
      return BadRequest(new { message = "Não é possível excluir uma categoria que possui transações vinculadas." });
    }

    _context.Categorias.Remove(categoria);
    await _context.SaveChangesAsync();

    return Ok(new { message = "Categoria excluída com sucesso." });
  }

  private bool CategoriaExists(Guid id)
  {
    return _context.Categorias.Any(e => e.Id == id);
  }
}