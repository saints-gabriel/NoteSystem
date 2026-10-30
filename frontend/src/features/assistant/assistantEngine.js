import { weekdayIndex } from "../../utils/dates.js";
import { formatCurrency } from "../../utils/format.js";

export const ASSISTANT_SUGGESTIONS = [
  "Resuma os pagamentos em atraso",
  "Como está a agenda de hoje?",
  "Quais alunos têm risco de frequência?",
];

const FALLBACK =
  "Posso ajudar com resumos de alunos, agenda, finanças e frequência. Experimente uma das sugestões abaixo.";
const sumAmount = (items) => items.reduce((total, item) => total + Number(item.amount), 0);
const matches = (text, terms) => terms.some((term) => text.includes(term));

/** Respostas baseadas em regras, calculadas sobre os dados carregados da API. */
export function answerQuestion(question, { students, classes, transactions }) {
  const text = question.toLowerCase();

  if (matches(text, ["atras", "financeiro", "receita"])) {
    const late = transactions.filter((t) => t.status === "Atrasado");
    const paid = transactions.filter((t) => t.status === "Pago");
    return `Há ${late.length} cobranças em atraso, totalizando ${formatCurrency(sumAmount(late))}. O total já recebido na base é ${formatCurrency(sumAmount(paid))}.`;
  }
  if (matches(text, ["aula", "agenda", "hoje"])) {
    const today = classes
      .filter((c) => c.day === weekdayIndex())
      .sort((a, b) => a.start.localeCompare(b.start));
    return today.length
      ? `Existem ${today.length} aulas programadas para hoje. A primeira é ${today[0].student}, às ${today[0].start}.`
      : "Não há aulas programadas para hoje.";
  }
  if (matches(text, ["frequ", "risco", "aluno"])) {
    const risk = students.filter((s) => s.status !== "Inativo" && s.attendance < 80);
    return `${risk.length} aluno(s) estão com frequência abaixo de 80%: ${risk.map((s) => s.name).join(", ") || "nenhum"}. Recomendo revisar o acompanhamento pedagógico.`;
  }
  return FALLBACK;
}
