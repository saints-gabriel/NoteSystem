# NoteSystem · Frontend

Interface de gestão para escolas de música, construída com React 19, Bun e Tailwind CSS 4. O sistema utiliza dark mode permanente, tokens de cor em OKLCH, tipografia JetBrains Mono para dados e componentes com bordas, brilho e sombras parametrizados.

## Módulos

- Visão geral com indicadores, agenda, receita e insights operacionais
- Alunos com busca, filtros, cadastro, edição, detalhes e exportação CSV
- Agenda semanal com filtros e agendamento de aulas
- Turmas e cursos com ocupação e distribuição de matrículas
- Financeiro com cobranças, filtros e baixa manual de pagamentos
- Pedagógico com progresso, repertório e avaliações
- Relatórios com períodos, indicadores e exportação CSV
- Configurações, notificações, backup JSON e restauração da demonstração
- Assistente N.O.T.E. com respostas calculadas a partir dos dados locais

## Executar

```bash
bun install
bun dev
```

## Build de produção

```bash
bun run build
bun start
```

O build é gerado em `dist/`.

## Dados e persistência

Esta etapa entrega o frontend completo e funcional em ambiente de demonstração. Os dados são persistidos no `localStorage` do navegador, sem sincronização entre dispositivos. Limpar os dados do navegador remove as alterações. O backend presente no repositório ainda não está conectado a esta interface.

## Estrutura

- `src/App.jsx`: componentes, módulos, fluxos e estado da aplicação
- `src/index.css`: tokens visuais, componentes, animações e responsividade
- `src/data/demo.js`: dados iniciais da demonstração
- `src/frontend.tsx`: entrada React
- `src/index.ts`: servidor Bun

A interface inclui navegação por teclado, foco visível, modais com contenção de foco, suporte a `prefers-reduced-motion` e layouts adaptados para desktop, tablet e celular.
