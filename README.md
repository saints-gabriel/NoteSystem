# ERP para Escolas de Música

Sistema: NoteSystem

Empresa: Oficina V12

Integrantes: Angelo, Gabriel Martins e Jhulian

## Propostas de desenvolvimento:

**O que é:** um sistema de gestão instalado no servidor da própria escola, voltado a escolas de música independentes (30 a 300 alunos). Cobre matrículas, turmas, agenda, presença, reposição e mensalidades, sem cobrança por aluno e com suporte humano. A escola de música é o primeiro nicho; o mesmo núcleo pode depois servir a escolas de idiomas, academias e reforço escolar.

**Dores resolvidas:** hoje essas escolas vivem de planilha, caderno e WhatsApp. Faltam controle de inadimplência, uma grade sem conflitos, gestão de reposições e repasse a professores. Os sistemas genéricos não entendem aula individual, recesso ou comissão de professor.

**Perfis:** administrador, professor, aluno/responsável e visitante (lead da landing page).

**Módulos principais:**
- Landing page editável, com formulário de aula experimental
- Alunos e matrículas, com responsável legal e financeiro
- Cursos, turmas, salas e agenda com detecção de conflito
- Chamada pelo celular, faltas e créditos de reposição
- Acompanhamento pedagógico (conteúdo, repertório, avaliações)
- Financeiro: planos, descontos, cobranças automáticas, baixa manual, inadimplência e repasse de professores
- Comunicação, eventos/recitais, relatórios e administração (backup, auditoria, LGPD)

**Diferenciais de regra de negócio:** aula individual e coletiva convivem, a reposição tem validade configurável, a mensalidade é fixa por mês, há regras de recesso e trancamento, desconto por irmãos, responsável financeiro diferente do aluno, repasse flexível e cobrança unificada para quem faz mais de um curso.

**Modelo comercial:**
- Pacotes: Essencial, Gestão e Completo
- Receitas: licença única, mensalidade de suporte, setup assistido e horas de customização
- Upsell: gateway PIX/boleto, WhatsApp, contratos, PWA, certificados e aulas online

**Fases de entrega:**
1. **MVP:** landing, login, alunos, turmas, agenda, chamada, mensalidades manuais, inadimplência e backup
2. **Fase 2:** reposição, repasse, área do aluno e relatórios
3. **Fase 3:** eventos, instrumentos e funil completo
4. **Fase 4:** integrações pagas

## Arquitetura

### Backend (`backend/src`)

Camadas, do request ao banco: `routes → middlewares → controllers → services → repositories → models`.

| Pasta | Responsabilidade |
| --- | --- |
| `config/` | variáveis de ambiente (validadas com zod), conexão com o banco, locale do zod |
| `constants/` | papéis (`roles.js`) e **registro de recursos** com permissões (`resources.js`) |
| `models/` | modelos Sequelize (`User`, `Record`) |
| `repositories/` | único ponto de acesso ao banco; trocar o armazenamento não afeta o resto |
| `services/` | regras de negócio (finanças, dashboard, relatórios, portal, auditoria...) |
| `controllers/` | traduzem HTTP ⇄ services (sem regra de negócio) |
| `routes/` | mapa de endpoints; `routes/index.js` monta tudo |
| `middlewares/` | autenticação, autorização por papel/recurso, validação, tratamento de erros |
| `validators/` | schemas zod (um por recurso em `resourceSchemas.js`) |
| `database/` | inicialização, `seeders.js` e dados de demonstração em `seeds/` |
| `utils/` | datas, números, erros HTTP, token |

**Adicionar um novo recurso CRUD** (ex.: `instruments`): 1) registre-o em `constants/resources.js`
(com os papéis permitidos); 2) crie o schema em `validators/resourceSchemas.js`; 3) opcionalmente,
adicione um seed em `database/seeds/`. As rotas `GET/POST /api/instruments` e `PATCH /api/instruments/:id`
passam a existir, com validação, permissões e auditoria.

Endpoints além do CRUD: `/api/dashboard`, `/api/finance/summary|payouts`, `/api/reports/:type`,
`/api/reports/enrollment-mix`, `/api/settings`, `/api/portal`, `/api/admin/backup|reset-demo`,
`/api/auth/login|me`, `/api/public/leads`.

### Frontend (`frontend/src`)

| Pasta | Responsabilidade |
| --- | --- |
| `app/` | rotas (`AppRoutes.jsx`) e proteção por papel (`RoleRoute.jsx`) |
| `config/` | URL da API, papéis e **navegação** (`navigation.js`: menu, busca e breadcrumb) |
| `services/` | cliente HTTP e um serviço por domínio; nenhum componente chama `fetch` |
| `context/` | sessão, toasts, cache de recursos da API (`useResource`) e estado de UI do workspace |
| `hooks/` | `useAsync`, `useKeydown`, `combineQueries` |
| `components/ui` | componentes reutilizáveis (Badge, Modal, StatCard, AsyncContent...) |
| `components/layout` | Sidebar, Topbar, busca global, notificações, perfil, layout do workspace |
| `components/charts` | gráficos |
| `features/*` | uma pasta por tela/módulo (dashboard, students, finance, ...) |
| `features/forms` | formulários declarativos (`formConfigs.js`) |
| `utils/` | formatação, datas e download |

**Adicionar uma tela:** crie `features/<nome>/<Nome>Page.jsx`, registre a rota em `app/AppRoutes.jsx`
e o item em `config/navigation.js`. **Adicionar um formulário:** descreva-o em `features/forms/formConfigs.js`
e abra com `openForm("<tipo>")`. Nenhum dado é fixo no frontend: tudo vem da API.

### Padronização

`bun run format` / `npm run format` (Prettier) em `backend/` e `frontend/`; `format:check` valida.

# 

To install dependencies:

```bash
bun install
```

## Desenvolvimento

Em terminais separados, inicie a API e o frontend:

```bash
cd backend
cp .env.example .env
bun install
bun run dev
```

```bash
cd frontend
bun install
bun dev
```

A API usa SQLite local, cria as tabelas e carrega os dados iniciais automaticamente.
O acesso inicial é `admin@notesystem.local` / `admin123`; altere esses valores no
arquivo `backend/.env`. O frontend usa `BUN_PUBLIC_API_URL` (padrão `http://localhost:3001`)
para localizar a API. Com `SEED_DEMO_DATA=false` a API cria só o administrador (sem dados de demonstração).
Para voltar aos dados de demonstração, apague `backend/data/` ou use Configurações → Restaurar dados (admin).

Rotas públicas:

- `/` ou `/login`: login inicial com redirecionamento por papel.
- `/landing`: Landing Page e formulário de aula experimental.

Usuários de demonstração:

- Administrador: `admin@notesystem.local` / `admin123`
- Professor: `professor@notesystem.local` / `professor123`
- Aluno: `aluno@notesystem.local` / `aluno123`

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

To type check:

```bash
bun check
```

This project was created using `bun init` in bun v1.4.3. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
