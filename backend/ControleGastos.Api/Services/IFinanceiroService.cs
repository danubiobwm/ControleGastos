using ControleGastos.Api.Models;
using ControleGastos.Api.DTOs;

namespace ControleGastos.Api.Services;

public interface IFinanceiroService
{
  Task<(bool Success, string Message, Transacao? Data)> SalvarTransacaoAsync(TransacaoRequest request);
  Task<object> ObterTotaisPorPessoaAsync();
  Task<object> ObterTotaisPorCategoriaAsync();
  Task<IEnumerable<Transacao>> ListarTransacoesAsync();
}