using Microsoft.EntityFrameworkCore;
using ControleGastos.Api.Models;

namespace ControleGastos.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Pessoa> Pessoas => Set<Pessoa>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Transacao> Transacoes => Set<Transacao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Regra de Negócio: Deletar pessoa apaga transações
        modelBuilder.Entity<Pessoa>()
            .HasMany(p => p.Transacoes)
            .WithOne(t => t.Pessoa)
            .OnDelete(DeleteBehavior.Cascade);
    }
}