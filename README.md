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
arquivo `backend/.env`. O frontend usa `VITE_API_URL` (padrão `http://localhost:3001`)
para localizar a API.

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
