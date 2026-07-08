# OVGS - Sistema de Gestao de Ordens de Venda

Implementacao full stack do desafio tecnico para gestao do ciclo de vida de Ordens de Venda.

A solucao foi desenhada para demonstrar dominio de frontend senior, integracao ponta a ponta e modelagem de regras de negocio no backend, sem adicionar complexidade artificial.

## Stack

Backend:

- Node.js
- TypeScript
- NestJS
- PostgreSQL
- Prisma
- Docker Compose
- Jest e Supertest
- Swagger/OpenAPI

Frontend:

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Query
- Redux Toolkit
- React Hook Form
- Zod
- React Testing Library
- React-Toastify

## Controle de acesso

Para manter o desafio focado no dominio, a autenticacao foi simulada por headers HTTP.
Rotas protegidas exigem:

```txt
x-user-role: MASTER_ADMIN | OPERATIONS | VIEWER
x-user-id: identificador-do-usuario
```

Papeis:

- `MASTER_ADMIN`: acesso total a todos os modulos, CRUD e compartilhamento.
- `OPERATIONS`: leitura dos cadastros, operacao de OVs, agendamento e auditoria.
- `VIEWER`: acesso somente leitura.

O frontend envia `MASTER_ADMIN` por padrao para manter a demo operacional. Em producao, essa camada deveria ser substituida por autenticacao real com JWT/sessao e claims de permissao.

## Como executar com Docker

```bash
docker compose up --build
```

Servicos:

- Web: http://localhost:3001
- API: http://localhost:3333
- Swagger: http://localhost:3333/docs
- PostgreSQL: localhost:15433

O container da API executa `prisma db push` e `prisma db seed` ao iniciar.

## Como executar localmente

Instale as dependencias:

```bash
pnpm install
```

Suba somente o banco:

```bash
docker compose up postgres
```

Configure as variaveis:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Prepare o banco:

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

Execute API e web:

```bash
pnpm dev
```

## Scripts

```bash
pnpm build
pnpm test
pnpm --filter @ovgs/api test
pnpm --filter @ovgs/web test
pnpm --filter @ovgs/api build
pnpm --filter @ovgs/web build
```

## Arquitetura

O repositorio usa monorepo com duas aplicacoes:

```txt
apps/
  api/
  web/
```

Backend:

```txt
apps/api/src/
  common/
    filters/
    prisma/
  modules/
    audit/
    customers/
    items/
    sales-orders/
    scheduling/
    transport-types/
```

Frontend:

```txt
apps/web/src/
  app/
  components/
    atoms/
    molecules/
    organisms/
    templates/
  features/
  lib/
```

## Padroes de codigo

- Componentes React, hooks, clients de API e helpers usam declaracao por `const`.
- Rotas do Next.js declaram o componente como `const Nome = () => {}` e fazem `export default Nome` no final, porque o App Router exige default export em `page.tsx` e `layout.tsx`.
- Classes foram mantidas apenas onde o framework pede esse padrao, como controllers, services, repositories, guards e modules do NestJS.
- Regras de negocio nao ficam em componentes React nem controllers: ficam em services e funcoes puras testaveis.
- Componentes seguem Atomic Design sem criar abstracoes genericas prematuras.
- Nao ha `any`, `as any`, `console.log` ou TODO nos arquivos de aplicacao.

## Decisoes arquiteturais

- A API usa arquitetura modular do NestJS com `controller`, `service` e `repository`.
- Regras de negocio ficam nos services, nao no controller nem no frontend.
- Prisma concentra a persistencia relacional e constraints como SKU unico e documento unico.
- Auditoria foi modelada como evento generico para permitir rastreabilidade sem acoplar cada entidade a uma tabela diferente.
- React Query gerencia server state, cache e invalidacao.
- Redux Toolkit foi usado apenas para filtros operacionais da tela de Ordens, evitando duplicacao de dados da API.
- Redux Saga nao foi usado porque o dominio implementado nao possui fluxo assincrono orquestrado o bastante para justificar a dependencia.
- React-Toastify foi usado para feedbacks de sucesso por ser uma biblioteca madura, simples de configurar e com versao recente.
- Atomic Design foi aplicado com pragmatismo: componentes visuais pequenos, organismos de dominio e templates de pagina.

## Modelagem de dominio

Entidades principais:

- `Customer`
- `TransportType`
- `CustomerTransportType`
- `Item`
- `SalesOrder`
- `SalesOrderItem`
- `AuditEvent`

Fluxo operacional:

```txt
CRIADA -> PLANEJADA -> AGENDADA -> EM_TRANSPORTE -> ENTREGUE
```

Transicoes fora dessa sequencia sao rejeitadas pela API.

## Regras de negocio implementadas

- Cliente pode possuir uma lista de tipos de transporte autorizados.
- Ordem de Venda so pode ser criada com transporte autorizado para o cliente.
- Tipo de transporte e cadastravel, sem alterar regra de negocio existente.
- Ordem de Venda pertence a um unico cliente.
- Ordem de Venda possui exatamente um tipo de transporte.
- Ordem de Venda deve conter ao menos um item.
- Itens possuem SKU unico e precisam existir previamente.
- Status deve seguir o fluxo operacional valido.
- Agendamento permite data, janela de atendimento, confirmacao e reagendamento.
- Alteracao de transporte valida novamente a autorizacao do cliente.

## Auditoria

Eventos registrados:

- Criacao de Ordem de Venda
- Alteracao de status
- Alteracao de agendamento
- Alteracao de transporte

Cada evento contem:

- data/hora
- tipo de acao
- entidade afetada
- estado anterior
- estado posterior

## Endpoints principais

```txt
GET    /customers
POST   /customers
PATCH  /customers/:id

GET    /transport-types
POST   /transport-types
PATCH  /transport-types/:id

GET    /items
POST   /items

GET    /sales-orders
POST   /sales-orders
GET    /sales-orders/:id
PATCH  /sales-orders/:id/status
PATCH  /sales-orders/:id/schedule
PATCH  /sales-orders/:id/transport
POST   /sales-orders/:id/share

GET    /scheduling
PATCH  /scheduling/:salesOrderId

GET    /audit-events
GET    /sales-orders/:id/audit-events

GET    /health
GET    /shared/sales-orders/:token
```

## Testes

Backend:

- teste unitario do fluxo de status;
- teste unitario das regras de negocio de Ordem de Venda;
- teste de integracao HTTP cobrindo criacao de OV e auditoria.
- teste de conexao/health check;
- teste de matriz de permissoes e `MASTER_ADMIN`;
- teste de acesso a modulos protegidos;
- teste de bloqueio de CRUD para `VIEWER`;
- teste de compartilhamento por token.

Frontend:

- teste de renderizacao do `StatusBadge`;
- teste do reducer de filtros operacionais.

## Matriz de cobertura do PDF

| Requisito | Cobertura |
| --- | --- |
| API REST | NestJS controllers por modulo |
| Modelagem de dominio | Prisma schema com entidades e relacoes |
| Persistencia relacional | PostgreSQL + Prisma |
| Regras de negocio | `SalesOrdersService` |
| Auditoria | `AuditEvent` + `AuditService` |
| Testes automatizados | Jest, Supertest e RTL |
| Documentacao | Este README |
| Docker Compose | Banco, API e Web |
| Interface grafica | Next.js com Atomic Design |
| Gestao de OVs | Lista, criacao, detalhe e status |
| Monitoramento operacional | Dashboard + filtros |
| Central de agendamento | `/scheduling` |
| Cadastros basicos | Clientes, transportes e itens |
| Integracao com APIs | React Query consumindo API real |
| Tratamento de estados | Loading, empty, error e success simples |
| Validacoes de entrada | DTOs no backend, Zod/RHF no frontend |
| OpenAPI/Swagger | `/docs` |
| Conexoes | `/health` valida conectividade com banco |
| Acesso a modulos | Guard por modulo e acao |
| Master admin | `MASTER_ADMIN` com acesso total testado |
| Controle de acesso ao CRUD | Escritas bloqueadas para `VIEWER` |
| Compartilhar | Link publico por token para Ordem de Venda |

## Escalabilidade e performance

- Filtros operacionais sao aplicados na API, evitando excesso de processamento no cliente.
- React Query reduz chamadas repetidas e centraliza invalidacao apos mutacoes.
- A modelagem relacional preserva integridade entre cliente, transporte, item e OV.
- O fluxo de status esta isolado em funcao pura, facilitando extensao e teste.

## Trade-offs

- Nao foi incluida autenticacao para manter foco no dominio do desafio.
- Nao foi criada uma Clean Architecture completa para evitar excesso de camadas em um projeto pequeno.
- Auditoria foi implementada de forma generica; em producao, poderia evoluir para outbox/eventos ou trilhas por dominio.
- A central de agendamento usa disponibilidade simplificada, conforme permitido no enunciado.
