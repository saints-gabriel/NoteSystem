// `minutesAgo` é convertido em `createdAt` no momento do seed.
export const notifications = [
  {
    title: "Pagamento em atraso",
    text: "A mensalidade de Enzo está em atraso.",
    minutesAgo: 12,
    type: "warning",
    read: false,
  },
  {
    title: "Aula aguardando confirmação",
    text: "Theo Almeida · hoje às 16:00.",
    minutesAgo: 38,
    type: "info",
    read: false,
  },
  {
    title: "Meta mensal atualizada",
    text: "A receita de outubro está em andamento.",
    minutesAgo: 120,
    type: "success",
    read: true,
  },
];
