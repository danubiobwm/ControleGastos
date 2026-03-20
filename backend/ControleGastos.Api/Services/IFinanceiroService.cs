using ControleGastos.Api.Models;

namespace ControleGastos.Api.Services;

public interface IFinanceiroService
{
  Task<IEnumerable<Transacao>> ListarTransacoesAsync();
  Task<(bool Success, string Message)> SalvarTransacaoAsync(Transacao transacao);
  Task<object> ObterTotaisPorPessoaAsync();
  Task<object> ObterTotaisPorCategoriaAsync();
}