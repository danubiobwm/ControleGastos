#  Controle de Gastos Residencial - Backend

Este é o serviço de API para o sistema de Controle de Gastos, desenvolvido em **.NET 9** e **PostgreSQL**. A aplicação foi desenhada seguindo princípios de **SOLID** e possui regras de negócio estritas para garantir a integridade financeira.

##  Tecnologias Utilizadas

* **Runtime:** .NET 9
* **Banco de Dados:** PostgreSQL 16
* **ORM:** Entity Framework Core (Code First)
* **Documentação:** Swagger (OpenAPI)
* **Containerização:** Docker & Docker Compose

---

##  Funcionalidades Implementadas

###  Cadastro de Pessoas
* **CRUD Completo:** Criar, Listar, Editar e Deletar.
* **Delete Cascade:** Ao excluir uma pessoa, todas as suas transações são removidas automaticamente do banco de dados.
* **Auto-ID:** Identificadores únicos (GUID) gerados automaticamente pelo servidor.

###  Cadastro de Categorias
* **Gerenciamento:** Criação e Listagem de categorias.
* **Finalidade:** Suporte aos tipos `receita`, `despesa` ou `ambas`.

###  Gestão de Transações
* **Validação de Idade:** Usuários menores de 18 anos são impedidos de cadastrar receitas (apenas despesas permitidas).
* **Restrição de Categoria:** Bloqueio lógico que impede o uso de categorias de "Receita" em transações de "Despesa" e vice-versa.
* **Tratamento de Valores:** Garante que o valor da transação seja sempre um número positivo.

###  Relatórios e Totais
* **Consulta por Pessoa:** Exibe o total de entradas, saídas e o saldo individual, além do **Saldo Líquido Geral** de todos os usuários.
* **Consulta por Categoria:** Agrupamento financeiro baseado nas categorias utilizadas.

---

##  Como Executar

### Pré-requisitos
* Docker e Docker Compose instalados em sua máquina.

### Passo a Passo

1.  **Subir os Containers:**
    No terminal, dentro da pasta raiz do projeto, execute:
    ```bash
    docker compose up -d --build
    ```

2.  **Acessar a API (Swagger):**
    A documentação interativa estará disponível em: [http://localhost:5000/swagger](http://localhost:5000/swagger)

---

##  Como Testar as Regras de Negócio

### Utilizando o arquivo `testes.http`
Para facilitar os testes sem frontend, utilize a extensão **REST Client** no VS Code com o arquivo incluído na raiz:

1.  **Crie uma Pessoa:** Copie o `id` gerado no retorno.
2.  **Crie uma Categoria:** Copie o `id` gerado no retorno.
3.  **Crie uma Transação:** Cole os IDs nos respectivos campos do JSON de teste.

### Matriz de Validação

| Cenário de Teste | Resultado Esperado | Status HTTP |
| :--- | :--- | :--- |
| Criar Receita para Pessoa < 18 anos | Bloqueio por regra de idade | `400 Bad Request` |
| Usar Categoria "Receita" em Transação "Despesa" | Bloqueio por incompatibilidade | `400 Bad Request` |
| Deletar Pessoa com histórico | Remoção total (Cascata) | `204 No Content` |
| Enviar Valor Negativo | Conversão automática para positivo | `201 Created` |

---

##  Organização do Código

* `Controllers/`: Endpoints e roteamento da API (Pessoas, Categorias, Transações).
* `Models/`: Entidades do banco de dados e definições das tabelas do PostgreSQL.
* `DTOs/`: Objetos de transferência de dados para proteção de IDs e limpeza da interface Swagger.
* `Services/`: Camada de lógica de negócio (onde residem as validações de idade e categorias).
* `Data/`: Configuração do Contexto do Entity Framework (AppDbContext).
* `Migrations/`: Histórico de versionamento do banco de dados (Essencial para o comando `Update-Database`).

### Gerenciar Banco de Dados (Opcional)
Se precisar criar uma nova versão do banco após alterar um Model:
```bash
dotnet ef migrations add NomeDaSuaMudanca
dotnet ef database update
```

---
## 👤 Autor

**Jose Danubio**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/danubiodearaujo)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/danubiobwm)