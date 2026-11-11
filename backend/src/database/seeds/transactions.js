import { addMonths } from "../../utils/dates.js";
import { students } from "./students.js";

const MONTHLY_FEES = {
  Piano: 420,
  Violão: 360,
  Canto: 450,
  Bateria: 390,
  Violino: 460,
  Guitarra: 410,
  Baixo: 380,
};
const METHODS = ["Pix", "Cartão", "Boleto"];
const HISTORY_START = "2025-11";
const HISTORY_END = "2026-09";
// Sofia deixou de pagar a partir de setembro (a cobrança de outubro segue em atraso).
const LAST_PAID_MONTH = { "Sofia Rodrigues": "2026-08" };

const feeOf = (course) => MONTHLY_FEES[course];
const description = (course) => `Mensalidade · ${course}`;

function buildHistory() {
  const rows = [];
  students.forEach((student, studentIndex) => {
    const firstMonth = student.enrolledAt.slice(0, 7);
    const lastMonth = LAST_PAID_MONTH[student.name] ?? HISTORY_END;
    const dueDay = String(5 + ((studentIndex * 3) % 24)).padStart(2, "0");
    for (let month = HISTORY_START, step = 0; month <= HISTORY_END; month = addMonths(month, 1), step += 1) {
      if (month < firstMonth || month > lastMonth) continue;
      rows.push({
        student: student.name,
        description: description(student.course),
        due: `${month}-${dueDay}`,
        amount: feeOf(student.course),
        status: "Pago",
        method: METHODS[(studentIndex + step) % METHODS.length],
      });
    }
  });
  return rows;
}

const currentMonth = [
  { student: "Helena Martins", due: "2026-10-05", status: "Pago", method: "Pix" },
  { student: "Theo Almeida", due: "2026-10-08", status: "Pago", method: "Cartão" },
  { student: "Luna Ferreira", due: "2026-10-10", status: "Pago", method: "Pix" },
  { student: "Enzo Carvalho", due: "2026-10-15", status: "Atrasado", method: "Boleto" },
  { student: "Alice Nogueira", due: "2026-10-20", status: "Pago", method: "Pix" },
  { student: "Miguel Oliveira", due: "2026-10-28", status: "Pendente", method: "Boleto" },
  { student: "Davi Mendes", due: "2026-10-30", status: "Pendente", method: "Pix" },
  { student: "Sofia Rodrigues", due: "2026-10-02", status: "Atrasado", method: "Boleto" },
].map((entry) => {
  const { course } = students.find((student) => student.name === entry.student);
  return { ...entry, description: description(course), amount: feeOf(course) };
});

export const transactions = [...buildHistory(), ...currentMonth];
