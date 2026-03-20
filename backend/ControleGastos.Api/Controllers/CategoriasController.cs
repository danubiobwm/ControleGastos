using Microsoft.AspNetCore.Mvc;
using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
  private readonly AppDbContext _context;
  public CategoriasController(AppDbContext context) => _context = context;

  [HttpGet] public async Task<IActionResult> Get() => Ok(await _context.Categorias.ToListAsync());

  [HttpPost]
  public async Task<IActionResult> Post(Categoria c)
  {
    _context.Categorias.Add(c);
    await _context.SaveChangesAsync();
    return Ok(c);
  }
}