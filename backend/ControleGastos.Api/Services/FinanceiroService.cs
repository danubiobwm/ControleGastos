using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Services;

public class FinanceiroService : IFinanceiroService
{
  private readonly AppDbContext _context;

  public FinanceiroService(AppDbContext context) => _context = context;

  public async Task<(bool Success, string Message)> SalvarTransacaoAsync(Transacao transacao)
  {
    var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
    var categoria = await _context.Categorias.FindAsync(transacao.CategoriaId);

    if (pessoa == null || categoria == null) return (false, "Pessoa ou Categoria inexistente.");

    // Regra: Menor de 18 anos só pode registrar Despesa
    if (pessoa.Idade < 18 && transacao.Tipo == TipoTransacao.Receita)
      return (false, "Menores de 18 anos não podem registrar receitas.");

    // Regra: Validação cruzada Categoria x Tipo Transação
    if (transacao.Tipo == TipoTransacao.Despesa && categoria.Finalidade == Finalidade.Receita)
      return (false, "Categoria permitida apenas para Receitas.");

    if (transacao.Tipo == TipoTransacao.Receita && categoria.Finalidade == Finalidade.Despesa)
      return (false, "Categoria permitida apenas para Despesas.");

    _context.Transacoes.Add(transacao);
    await _context.SaveChangesAsync();
    return (true, "Transação salva com sucesso.");
  }

  public async Task<object> ObterTotaisPorPessoaAsync()
  {
    var consulta = await _context.Pessoas.Select(p => new
    {
      p.Nome,
      Receitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
      Despesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
      Saldo = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor) -
                p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
    }).ToListAsync();

    return new
    {
      Dados = consulta,
      Consolidado = new
      {
        TotalReceitas = consulta.Sum(x => x.Receitas),
        TotalDespesas = consulta.Sum(x => x.Despesas),
        SaldoLiquido = consulta.Sum(x => x.Saldo)
      }
    };
  }

  public async Task<object> ObterTotaisPorCategoriaAsync()
  {
    var consulta = await _context.Categorias.Select(c => new
    {
      c.Descricao,
      Receitas = _context.Transacoes.Where(t => t.CategoriaId == c.Id && t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
      Despesas = _context.Transacoes.Where(t => t.CategoriaId == c.Id && t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
      Saldo = _context.Transacoes.Where(t => t.CategoriaId == c.Id && t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor) -
                _context.Transacoes.Where(t => t.CategoriaId == c.Id && t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
    }).ToListAsync();

    return new { Dados = consulta };
  }
}