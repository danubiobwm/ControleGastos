namespace ControleGastos.Api.DTOs;

public record PessoaRequest(string Nome, int Idade);


public record PessoaTotalItem(
    string Nome,
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal Saldo
);

public record ConsultaTotaisResponse(
    IEnumerable<PessoaTotalItem> DetalhesPorPessoa,
    decimal TotalGeralReceitas,
    decimal TotalGeralDespesas,
    decimal SaldoLiquidoGeral
);


public record CategoriaRequest(string Descricao, string Finalidade);

public record TransacaoRequest(
    string Descricao,
    decimal Valor,
    string Tipo,
    Guid CategoriaId,
    Guid PessoaId
);

public record CategoriaTotalItem(
    string Descricao,
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal Saldo
);

public record ConsultaTotaisCategoriaResponse(
    IEnumerable<CategoriaTotalItem> DetalhesPorCategoria,
    decimal TotalGeralReceitas,
    decimal TotalGeralDespesas,
    decimal SaldoLiquidoGeral
);