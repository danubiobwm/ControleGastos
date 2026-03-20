using System.Text.Json.Serialization;

namespace ControleGastos.Api.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Finalidade { Receita, Despesa, Ambas }

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TipoTransacao { Receita, Despesa }