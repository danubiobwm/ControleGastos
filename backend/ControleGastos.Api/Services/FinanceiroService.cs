using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using ControleGastos.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Services;

public class FinanceiroService : IFinanceiroService
{
  private readonly AppDbContext _context;

  public FinanceiroService(AppDbContext context)
  {
    _context = context;
  }

  public async Task<IEnumerable<Transacao>> ListarTransacoesAsync()
  {
    return await _context.Transacoes
        .Include(t => t.Pessoa)
        .Include(t => t.Categoria)
        .ToListAsync();
  }

  public async Task<(bool Success, string Message, Transacao? Data)> SalvarTransacaoAsync(TransacaoRequest request)
  {
    var pessoa = await _context.Pessoas.FindAsync(request.PessoaId);
    var categoria = await _context.Categorias.FindAsync(request.CategoriaId);

    if (pessoa == null) return (false, "Pessoa não encontrada.", null);
    if (categoria == null) return (false, "Categoria não encontrada.", null);

    if (pessoa.Idade < 18 && request.Tipo.Equals("Receita", StringComparison.OrdinalIgnoreCase))
    {
      return (false, "Menores de 18 anos só podem registrar despesas.", null);
    }

    if (request.Tipo.Equals("Despesa", StringComparison.OrdinalIgnoreCase) &&
        categoria.Finalidade.Equals("Receita", StringComparison.OrdinalIgnoreCase))
    {
      return (false, "Esta categoria é permitida apenas para Receitas.", null);
    }

    if (request.Tipo.Equals("Receita", StringComparison.OrdinalIgnoreCase) &&
        categoria.Finalidade.Equals("Despesa", StringComparison.OrdinalIgnoreCase))
    {
      return (false, "Esta categoria é permitida apenas para Despesas.", null);
    }

    var novaTransacao = new Transacao
    {
      Descricao = request.Descricao,
      Valor = Math.Abs(request.Valor),
      Tipo = request.Tipo,
      PessoaId = request.PessoaId,
      CategoriaId = request.CategoriaId
    };

    _context.Transacoes.Add(novaTransacao);
    await _context.SaveChangesAsync();

    return (true, "Sucesso", novaTransacao);
  }

  public async Task<object> ObterTotaisPorPessoaAsync()
  {
    var lista = await _context.Pessoas
        .Select(p => new
        {
          Pessoa = p.Nome,
          TotalReceitas = p.Transacoes.Where(t => t.Tipo == "Receita").Sum(t => t.Valor),
          TotalDespesas = p.Transacoes.Where(t => t.Tipo == "Despesa").Sum(t => t.Valor),
          Saldo = p.Transacoes.Where(t => t.Tipo == "Receita").Sum(t => t.Valor) -
                    p.Transacoes.Where(t => t.Tipo == "Despesa").Sum(t => t.Valor)
        }).ToListAsync();

    return new
    {
      Listagem = lista,
      ResumoGeral = new
      {
        TotalReceitas = lista.Sum(x => x.TotalReceitas),
        TotalDespesas = lista.Sum(x => x.TotalDespesas),
        SaldoLiquido = lista.Sum(x => x.Saldo)
      }
    };
  }

  public async Task<object> ObterTotaisPorCategoriaAsync()
  {
    var lista = await _context.Categorias
        .Select(c => new
        {
          Categoria = c.Descricao,
          TotalReceitas = _context.Transacoes.Where(t => t.CategoriaId == c.Id && t.Tipo == "Receita").Sum(t => t.Valor),
          TotalDespesas = _context.Transacoes.Where(t => t.CategoriaId == c.Id && t.Tipo == "Despesa").Sum(t => t.Valor),
          Saldo = _context.Transacoes.Where(t => t.CategoriaId == c.Id && t.Tipo == "Receita").Sum(t => t.Valor) -
                    _context.Transacoes.Where(t => t.CategoriaId == c.Id && t.Tipo == "Despesa").Sum(t => t.Valor)
        }).ToListAsync();

    return new
    {
      Listagem = lista,
      ResumoGeral = new
      {
        TotalReceitas = lista.Sum(x => x.TotalReceitas),
        TotalDespesas = lista.Sum(x => x.TotalDespesas),
        SaldoLiquido = lista.Sum(x => x.Saldo)
      }
    };
  }
}