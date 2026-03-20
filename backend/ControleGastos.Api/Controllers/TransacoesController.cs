using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using ControleGastos.Api.DTOs;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
  private readonly AppDbContext _context;

  public TransacoesController(AppDbContext context) => _context = context;

  [HttpGet]
  public async Task<ActionResult<IEnumerable<Transacao>>> Get()
  {
    return await _context.Transacoes
        .Include(t => t.Categoria)
        .Include(t => t.Pessoa)
        .ToListAsync();
  }

  [HttpPost]
  public async Task<ActionResult<Transacao>> Post(TransacaoRequest request)
  {
    var pessoa = await _context.Pessoas.FindAsync(request.PessoaId);
    var categoria = await _context.Categorias.FindAsync(request.CategoriaId);

    if (pessoa == null) return BadRequest("Pessoa não encontrada.");
    if (categoria == null) return BadRequest("Categoria não encontrada.");

    if (request.Valor <= 0) return BadRequest("O valor deve ser um número positivo.");

    if (pessoa.Idade < 18 && request.Tipo.ToLower() == "receita")
    {
      return BadRequest("Menores de 18 anos só podem cadastrar despesas.");
    }


    if (request.Tipo.ToLower() == "despesa" && categoria.Finalidade.ToLower() == "receita")
    {
      return BadRequest("Não é permitido usar uma categoria de Receita para uma Despesa.");
    }

    if (request.Tipo.ToLower() == "receita" && categoria.Finalidade.ToLower() == "despesa")
    {
      return BadRequest("Não é permitido usar uma categoria de Despesa para uma Receita.");
    }

    var transacao = new Transacao
    {
      Descricao = request.Descricao,
      Valor = request.Valor,
      Tipo = request.Tipo,
      CategoriaId = request.CategoriaId,
      PessoaId = request.PessoaId
    };

    _context.Transacoes.Add(transacao);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(Get), new { id = transacao.Id }, transacao);
  }
}