## Sistema de Controle de Gastos Residencial
Este projeto é uma solução completa para gestão de finanças pessoais, permitindo o controle de receitas e despesas segmentadas por pessoas e categorias. A aplicação utiliza uma arquitetura moderna, com o backend em .NET, frontend em React e banco de dados PostgreSQL, todos orquestrados via Docker.

## Arquitetura do Projeto
Frontend: React 18 + Vite + TypeScript + Tailwind CSS (Porta 3000)

Backend: API .NET 8 (C#) + Entity Framework Core (Porta 5000)

Database: PostgreSQL 15 (Porta 5432)

🛠️ Como Subir o Projeto (Quick Start)
Para rodar a aplicação completa, você não precisa instalar o .NET ou o Node.js na sua máquina física, apenas o Docker Desktop.

1. Clonar o Repositório
Bash
git clone https://github.com/danubiobwm/ControleGastos

cd ControleGastos

2. Iniciar os Containers
Abra o terminal na pasta raiz do projeto (onde está o arquivo docker-compose.yml) e execute o comando abaixo:

Bash
docker-compose up --build
Nota: O parâmetro --build é fundamental para que o Docker compile as alterações mais recentes do seu código C# e React antes de subir os serviços.

3. Acessar a Aplicação
Assim que o Docker indicar que os containers estão "Running", acesse os endereços abaixo:

## Interface Web (Frontend): http://localhost:3000

## API (Backend): http://localhost:5000

## Swagger (Documentação da API): http://localhost:5000/swagger

## Estrutura de Pastas
```
Plaintext
.
├── backend/            # Código fonte da API em C#
│   ├── ControleGastos.Api/
│   └── Dockerfile      # Configuração da imagem .NET
├── frontend/           # Código fonte do React
│   ├── src/            # Service, Páginas e API
│   ├── Dockerfile      # Build de produção com Nginx
│   └── package.json    # Dependências e Scripts
└── docker-compose.yml  #
```

## Orquestração de todos os serviços
Comandos Úteis do Docker
Parar o sistema: docker-compose down

Ver logs em tempo real: docker-compose logs -f

Reiniciar um serviço específico (ex: frontend): docker-compose restart frontend

## Autor
Desenvolvido por Danubio