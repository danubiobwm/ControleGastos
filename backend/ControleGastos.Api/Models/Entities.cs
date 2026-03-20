using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ControleGastos.Api.Models;

// Enums para garantir integridade dos tipos
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Finalidade { Despesa, Receita, Ambas }

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TipoTransacao { Despesa, Receita }

public class Pessoa
{
    public Guid Id { get; set; } = Guid.NewGuid();
    [Required, MaxLength(200)] public string Nome { get; set; } = string.Empty;
    [Required] public int Idade { get; set; }
    public List<Transacao> Transacoes { get; set; } = new();
}

public class Categoria
{
    public Guid Id { get; set; } = Guid.NewGuid();
    [Required, MaxLength(400)] public string Descricao { get; set; } = string.Empty;
    [Required] public Finalidade Finalidade { get; set; }
}

public class Transacao
{
    public Guid Id { get; set; } = Guid.NewGuid();
    [Required, MaxLength(400)] public string Descricao { get; set; } = string.Empty;
    [Required, Range(0.01, double.MaxValue)] public decimal Valor { get; set; }
    [Required] public TipoTransacao Tipo { get; set; }
    [Required] public Guid CategoriaId { get; set; }
    public Categoria? Categoria { get; set; }
    [Required] public Guid PessoaId { get; set; }
    public Pessoa? Pessoa { get; set; }
}