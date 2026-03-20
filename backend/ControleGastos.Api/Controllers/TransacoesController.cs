using Microsoft.AspNetCore.Mvc;
using ControleGastos.Api.Models;
using ControleGastos.Api.Services;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
  private readonly IFinanceiroService _service;
  public TransacoesController(IFinanceiroService service) => _service = service;

  [HttpPost]
  public async Task<IActionResult> Create(Transacao transacao)
  {
    var (success, message) = await _service.SalvarTransacaoAsync(transacao);
    if (!success) return BadRequest(new { error = message });
    return Ok(transacao);
  }

  [HttpGet("totais-pessoa")]
  public async Task<IActionResult> GetTotaisPessoa() => Ok(await _service.ObterTotaisPorPessoaAsync());
}