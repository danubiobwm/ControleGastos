using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Services;

public class FinanceiroService : IFinanceiroService
{
  private readonly AppDbContext _context;

  public FinanceiroService(AppDbContext context) => _context = context;

  public async Task<IEnumerable<Transacao>> ListarTransacoesAsync()
      => await _context.Transacoes.Include(t => t.Pessoa).Include(t => t.Categoria).ToListAsync();

  public async Task<(bool Success, string Message)> SalvarTransacaoAsync(Transacao transacao)
  {
    var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
    var categoria = await _context.Categorias.FindAsync(transacao.CategoriaId);

    if (pessoa == null || categoria == null) return (false, "Pessoa ou Categoria não encontrada.");

    // Regra: Menor de 18 anos só pode registrar Despesa
    if (pessoa.Idade < 18 && transacao.Tipo == TipoTransacao.Receita)
      return (false, "Menores de 18 anos não podem registrar receitas.");

    // Regra: Validação de Finalidade da Categoria
    if (transacao.Tipo == TipoTransacao.Despesa && categoria.Finalidade == Finalidade.Receita)
      return (false, "Esta categoria é exclusiva para receitas.");

    if (transacao.Tipo == TipoTransacao.Receita && categoria.Finalidade == Finalidade.Despesa)
      return (false, "Esta categoria é exclusiva para despesas.");

    _context.Transacoes.Add(transacao);
    await _context.SaveChangesAsync();
    return (true, "Sucesso");
  }

  public async Task<object> ObterTotaisPorPessoaAsync()
  {
    var lista = await _context.Pessoas.Select(p => new
    {
      p.Nome,
      Receitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
      Despesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
      Saldo = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor) -
                p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
    }).ToListAsync();

    return new
    {
      Dados = lista,
      TotalGeral = new
      {
        Receitas = lista.Sum(x => x.Receitas),
        Despesas = lista.Sum(x => x.Despesas),
        SaldoLiquido = lista.Sum(x => x.Saldo)
      }
    };
  }

  public async Task<object> ObterTotaisPorCategoriaAsync()
  {
    var lista = await _context.Categorias.Select(c => new
    {
      c.Descricao,
      Receitas = _context.Transacoes.Where(t => t.CategoriaId == c.Id && t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
      Despesas = _context.Transacoes.Where(t => t.CategoriaId == c.Id && t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
      Saldo = _context.Transacoes.Where(t => t.CategoriaId == c.Id && t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor) -
                _context.Transacoes.Where(t => t.CategoriaId == c.Id && t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
    }).ToListAsync();

    return new { Dados = lista };
  }
}