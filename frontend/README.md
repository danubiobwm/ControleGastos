#  Sistema de Controle de Gastos Residencial

Este é um projeto Full Stack desenvolvido para gerenciar finanças residenciais, permitindo o controle de receitas e despesas por pessoa e categoria. A aplicação é totalmente conteinerizada com Docker para facilitar a configuração e o deploy.

##  Tecnologias

### Frontend
- **React 18** com **Vite**
- **TypeScript**
- **Tailwind CSS** (Estilização)
- **Lucide React** (Ícones)
- **React Router Dom** (Navegação)
- **Axios** (Consumo de API)

### Backend
- **.NET API** (C#)
- **Entity Framework Core**
- **PostgreSQL** (Banco de Dados)

---

##  Como Executar o Projeto com Docker

Certifique-se de ter o **Docker** e o **Docker Compose** instalados em sua máquina.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/danubiobwm/ControleGastos/
    cd ControleGastos
    ```

2.  **Suba os containers:**
    ```bash
    docker-compose up --build
    ```

3.  **Acesse as aplicações:**
    - **Frontend:** [http://localhost:3000](http://localhost:3000)
    - **Backend (API):** [http://localhost:5000](http://localhost:5000)
    - **Banco de Dados:** Porta `5432`

---

##  Estrutura do Projeto

```text
.
├── backend/            # API em .NET
├── frontend/           # Aplicação React
│   ├── src/
│   │   ├── api/        # Configuração do Axios
│   │   ├── components/ # Componentes reutilizáveis
│   │   ├── layouts/    # Estrutura principal (Sidebar/Header)
│   │   └── pages/      # Dashboard, Pessoas, etc.
│   └── Dockerfile      # Build de produção com Nginx
└── docker-compose.yml  # Orquestração dos serviços (DB, API, Web)
```
## Notas Técnicas Importantes
Dashboard e API
O Dashboard consome o endpoint /pessoas/totais. Ele espera um objeto JSON no seguinte formato para funcionar corretamente:
```
{
  "totalGeralReceitas": 1500,
  "totalGeralDespesas": 500,
  "saldoLiquidoGeral": 1000,
  "detalhesPorPessoa": [
    { "nome": "João", "totalReceitas": 1500, "totalDespesas": 500, "saldo": 1000 }
  ]
}
```
### Estilização
O projeto utiliza Tailwind CSS. Se o layout aparecer desalinhado, verifique se o arquivo tailwind.config.js na pasta frontend está processando os arquivos na pasta src.

### Banco de Dados
O banco PostgreSQL é inicializado automaticamente. Caso as tabelas não sejam encontradas, verifique se as migrations do Entity Framework foram aplicadas ou se os nomes das tabelas no código batem com o banco (ex: "Pessoas" vs "pessoas").

### Autor
Desenvolvido por Danubio.