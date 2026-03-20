using Microsoft.AspNetCore.Mvc;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Services;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
  private readonly IFinanceiroService _service;

  public TransacoesController(IFinanceiroService service) => _service = service;

  [HttpPost]
  public async Task<IActionResult> Create(TransacaoRequest request)
  {
    var (success, message, data) = await _service.SalvarTransacaoAsync(request);

    if (!success) return BadRequest(new { error = message });

    return Ok(data);
  }
}