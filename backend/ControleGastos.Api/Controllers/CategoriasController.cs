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
}