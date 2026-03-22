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
        .OrderByDescending(t => t.Id)
        .ToListAsync();
  }

  [HttpPost]
  public async Task<ActionResult<Transacao>> Post(TransacaoRequest request)
  {
    var pessoa = await _context.Pessoas.FindAsync(request.PessoaId);
    var categoria = await _context.Categorias.FindAsync(request.CategoriaId);

    if (pessoa == null) return BadRequest(new { message = "Pessoa não encontrada." });
    if (categoria == null) return BadRequest(new { message = "Categoria não encontrada." });

    if (!string.IsNullOrEmpty(request.Descricao) && request.Descricao.Length > 400)
      return BadRequest(new { message = "A descrição não pode exceder 400 caracteres." });

    if (request.Valor <= 0)
      return BadRequest(new { message = "O valor da transação deve ser um número positivo." });

    if (pessoa.Idade < 18 && request.Tipo.ToLower() == "receita")
    {
      return BadRequest(new { message = "Menores de 18 anos só podem cadastrar despesas." });
    }

    var tipoTransacao = request.Tipo.ToLower();
    var finalidadeCat = categoria.Finalidade.ToLower();

    if (tipoTransacao == "despesa" && finalidadeCat == "receita")
      return BadRequest(new { message = $"A categoria '{categoria.Descricao}' é exclusiva para receitas." });

    if (tipoTransacao == "receita" && finalidadeCat == "despesa")
      return BadRequest(new { message = $"A categoria '{categoria.Descricao}' é exclusiva para despesas." });

    var transacao = new Transacao
    {
      Id = Guid.NewGuid(),
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

  [HttpGet("dashboard")]
  public async Task<IActionResult> GetDashboard()
  {
    var pessoas = await _context.Pessoas.ToListAsync();
    var transacoes = await _context.Transacoes.ToListAsync();

    var detalhesPorPessoa = pessoas.Select(p =>
    {
      var rec = transacoes.Where(t => t.PessoaId == p.Id && t.Tipo.ToLower() == "receita").Sum(t => t.Valor);
      var des = transacoes.Where(t => t.PessoaId == p.Id && t.Tipo.ToLower() == "despesa").Sum(t => t.Valor);
      return new
      {
        Nome = p.Nome,
        Receitas = rec,
        Despesas = des,
        Saldo = rec - des
      };
    }).ToList();

    var totalGeralReceitas = detalhesPorPessoa.Sum(d => d.Receitas);
    var totalGeralDespesas = detalhesPorPessoa.Sum(d => d.Despesas);

    return Ok(new
    {
      totalGeralReceitas,
      totalGeralDespesas,
      saldoLiquidoGeral = totalGeralReceitas - totalGeralDespesas,
      detalhesPorPessoa
    });
  }
}