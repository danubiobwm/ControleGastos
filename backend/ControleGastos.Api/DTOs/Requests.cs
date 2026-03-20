namespace ControleGastos.Api.DTOs;

public record PessoaRequest(string Nome, int Idade);

public record CategoriaRequest(string Descricao, string Finalidade);

public record TransacaoRequest(string Descricao, decimal Valor, string Tipo, Guid CategoriaId, Guid PessoaId);