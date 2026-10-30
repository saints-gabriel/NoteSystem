export const STUDENT_STATUSES = ["Ativo", "Pendente", "Inativo"];

export const statusTone = (status) =>
  status === "Ativo" ? "green" : status === "Pendente" ? "yellow" : "neutral";
