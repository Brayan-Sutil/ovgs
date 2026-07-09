# OVGS - Sistema de Gestão de Ordens de Venda

## Ambiente Publicado

- Aplicação web: https://ovgs-web.vercel.app/login
- API: https://ovgs-api.onrender.com
- Health check: https://ovgs-api.onrender.com/health

## CI/CD

- CI: GitHub Actions executa testes e builds em push e pull request para `main`.
- CD: Vercel e Render estão conectados ao repositório e publicam a partir da branch `main`.

Implementação full stack do desafio técnico **Sistema de Gestão de Ordens de Venda (OVGS)**.

O projeto centraliza o ciclo de vida de Ordens de Venda, com backend real, banco relacional, interface web, validações, auditoria, controle de acesso e testes automatizados.

## Funcionalidades

- Cadastro, consulta e edição de clientes.
- Cadastro, consulta e edição de tipos de transporte.
- Cadastro e consulta de itens.
- Criação, consulta e detalhamento de Ordens de Venda.
- Atualização de status no fluxo operacional.
- Filtros por status, cliente, transporte e data.
- Central de agendamento com data, janela de atendimento, confirmação e reagendamento.
- Auditoria de criação de OV, alteração de status, agendamento e transporte.
- Compartilhamento público de Ordem de Venda por token.
- Login demonstrativo para empresa e cliente.
- Visão de cliente em modo somente leitura.
- Interface responsiva para desktop e mobile web.
- Internacionalização em português, inglês e espanhol.

## Stack

Backend:

- Node.js
- TypeScript
- NestJS
- PostgreSQL
- Prisma
- Docker Compose
- Jest
- Supertest
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
- next-intl
- Jest
- React Testing Library

## Como Rodar Com Docker

```bash
docker compose up --build
```

Serviços:

- Web: http://localhost:3001
- API: http://localhost:3333
- Swagger: http://localhost:3333/docs
- PostgreSQL: localhost:15433

Ao iniciar, o container da API executa automaticamente:

```bash
pnpm --filter @ovgs/api db:push
pnpm --filter @ovgs/api db:seed
```

## Como Usar A Demo

Na tela de login, existem dois perfis:

- **Empresa**: acesso administrativo para cadastros, Ordens de Venda, agendamento, auditoria e compartilhamento.
- **Cliente**: seleciona um cliente cadastrado e acessa uma visão simples, somente leitura, das próprias Ordens de Venda.

Se não houver cliente cadastrado, a tela informa o problema e orienta o usuário a entrar como empresa para criar o primeiro cadastro.

## Como Rodar Localmente

Instale as dependências:

```bash
pnpm install
```

Suba somente o banco:

```bash
docker compose up -d postgres
```

Crie `apps/api/.env`:

```env
DATABASE_URL="postgresql://ovgs:ovgs@localhost:15433/ovgs?schema=public"
WEB_ORIGIN="http://localhost:3000"
PORT=3333
```

Opcionalmente, crie `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3333"
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

No modo local, a web roda em http://localhost:3000 e a API em http://localhost:3333.

## Scripts Úteis

```bash
pnpm build
pnpm test
pnpm --filter @ovgs/api build
pnpm --filter @ovgs/web build
pnpm --filter @ovgs/api test
pnpm --filter @ovgs/web test
```

## Estrutura Do Projeto

```txt
apps/
  api/
    prisma/
    src/
      common/
      modules/
        audit/
        customers/
        health/
        items/
        sales-orders/
        scheduling/
        sharing/
        transport-types/
  web/
    src/
      app/
      auth/
      components/
        atoms/
        molecules/
        organisms/
        templates/
      features/
      i18n/
      lib/
```

## Arquitetura

Backend:

- API modular em NestJS.
- Separação entre `controller`, `service`, `repository` e `dto`.
- Regras de negócio concentradas nos services.
- Persistência relacional com Prisma.
- Tratamento global de exceções.
- Controle de acesso por guard e permissões por módulo/ação.

Frontend:

- Next.js App Router.
- Componentização seguindo Atomic Design.
- React Query para server state, cache e invalidação.
- Redux Toolkit apenas para filtros operacionais.
- React Hook Form e Zod para formulários e validações.
- Mensagens de erro exibidas diretamente nos campos.
- next-intl para tradução de textos visíveis.

## Modelagem De Domínio

Entidades principais:

- `Customer`
- `TransportType`
- `CustomerTransportType`
- `Item`
- `SalesOrder`
- `SalesOrderItem`
- `AuditEvent`
- `ShareLink`

Fluxo operacional da Ordem de Venda:

```txt
CRIADA -> PLANEJADA -> AGENDADA -> EM_TRANSPORTE -> ENTREGUE
```

Transições fora dessa sequência são rejeitadas pela API.

## Regras De Negócio

- Cliente possui uma lista de tipos de transporte autorizados.
- Ordem de Venda só pode ser criada com transporte autorizado para o cliente.
- Novos tipos de transporte podem ser cadastrados sem alterar a regra de negócio.
- Ordem de Venda pertence a um único cliente.
- Ordem de Venda possui exatamente um tipo de transporte.
- Ordem de Venda deve conter ao menos um item.
- Itens precisam estar previamente cadastrados e ativos.
- SKU de item é único.
- Status segue o fluxo operacional definido.
- Agendamento permite data, janela, confirmação e reagendamento.
- Alteração de transporte valida novamente a autorização do cliente.

## Controle De Acesso

A autenticação é simulada para manter o desafio focado no domínio. As rotas protegidas usam headers:

```txt
x-user-role: MASTER_ADMIN | OPERATIONS | VIEWER
x-user-id: identificador-do-usuario
```

Perfis:

- `MASTER_ADMIN`: acesso total.
- `OPERATIONS`: operação de Ordens de Venda, agendamento, auditoria e leitura dos cadastros.
- `VIEWER`: acesso somente leitura.

Na aplicação web, o login demonstrativo cria a sessão de empresa ou cliente e envia os headers esperados pela API.

## Auditoria

Eventos registrados:

- Criação de Ordem de Venda.
- Alteração de status.
- Alteração de agendamento.
- Alteração de transporte.

Cada evento guarda:

- data e hora;
- tipo de ação;
- entidade afetada;
- estado anterior, quando aplicável;
- estado posterior, quando aplicável.

## Endpoints Principais

```txt
GET    /health

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

GET    /shared/sales-orders/:token
```

## Testes

Backend:

- fluxo de status;
- regras de negócio de Ordem de Venda;
- health check e conexão com banco;
- matriz de permissões;
- acesso a módulos protegidos;
- bloqueio de escrita para `VIEWER`;
- acesso total para `MASTER_ADMIN`;
- compartilhamento por token;
- integração HTTP para criação de OV e auditoria.

Frontend:

- renderização de componentes;
- validações de formulários;
- reducer de filtros operacionais.

## Cobertura Do Desafio

| Requisito do PDF | Implementação |
| --- | --- |
| API REST | NestJS controllers por módulo |
| Modelagem de domínio | Prisma schema com entidades e relacionamentos |
| Persistência relacional | PostgreSQL + Prisma |
| Regras de negócio | Services da API |
| Auditoria | `AuditEvent` + `AuditService` |
| Testes automatizados | Jest, Supertest e React Testing Library |
| Documentação técnica | Este README |
| Docker Compose | PostgreSQL, API e Web |
| Interface gráfica | Next.js + Atomic Design |
| Gestão de OVs | Lista, criação, detalhe, status e transporte |
| Monitoramento operacional | Dashboard e filtros |
| Central de agendamento | `/scheduling` |
| Cadastros básicos | Clientes, transportes e itens |
| Integração com APIs | React Query consumindo a API real |
| Tratamento de estados | Loading, empty, error e disabled states |
| Validações de entrada | DTOs no backend, Zod/RHF no frontend |
| OpenAPI/Swagger | `/docs` |
| Segurança/autorização | Guard de permissões por módulo e ação |
| Compartilhamento | Link público por token |

## Decisões E Trade-offs

- A autenticação real não foi implementada; foi simulada por headers para focar no domínio do desafio.
- Redux Saga não foi incluído porque não há fluxo assíncrono complexo o suficiente para justificar a dependência.
- Clean Architecture completa não foi aplicada para evitar camadas desnecessárias em um projeto pequeno.
- A auditoria foi modelada de forma genérica para simplificar rastreabilidade e evolução.
- A disponibilidade de agenda foi mantida simples, conforme permitido pelo enunciado.
- O frontend usa mensagens inline nos formulários para erros de validação, mantendo o feedback perto do campo.

## Qualidade E Manutenção

- Código TypeScript tipado.
- Separação clara entre domínio, persistência e interface.
- Componentes reutilizáveis sem abstrações genéricas prematuras.
- Regras críticas cobertas por testes.
- Filtros aplicados na API para reduzir processamento no cliente.
- React Query evita chamadas duplicadas e centraliza invalidação após mutações.
