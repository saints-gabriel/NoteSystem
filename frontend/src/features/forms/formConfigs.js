import { defaultDueDate, toIsoDate, weekDays, weekdayIndex } from "../../utils/dates.js";

/**
 * Formulários declarativos. Para criar um novo cadastro basta descrever aqui:
 *  - resource/mode: recurso da API e se cria ("create") ou edita ("update");
 *  - fields: { name, label, type, required, full, options | source, default, ... }
 *      · type: text | email | tel | number | date | time | textarea | select
 *      · options: lista estática (strings ou { value, label })
 *      · source: { resource, value, label } → opções vindas da API
 *      · sync: { campoDestino: "atributoDaOpção" } copia dados da opção escolhida
 *  - success: mensagem exibida após salvar.
 */
const LEVELS = ["Iniciante", "Intermediário", "Avançado"];
const resourceOptions = (resource, value = "name", label = "name") => ({ resource, value, label });

const studentFields = [
  {
    name: "name",
    label: "Nome completo",
    required: true,
    full: true,
    autoFocus: true,
    placeholder: "Ex.: Marina Silva",
  },
  { name: "email", label: "E-mail", type: "email", placeholder: "aluno@email.com" },
  { name: "phone", label: "Telefone", type: "tel", placeholder: "(00) 00000-0000" },
  { name: "course", label: "Curso", type: "select", required: true, source: resourceOptions("courses") },
  {
    name: "teacher",
    label: "Professor",
    type: "select",
    required: true,
    source: resourceOptions("teachers"),
  },
  { name: "level", label: "Nível", type: "select", options: LEVELS, default: "Iniciante" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Ativo", "Pendente", "Inativo"],
    default: "Ativo",
  },
];

export const FORMS = {
  "new-student": {
    title: "Novo aluno",
    subtitle: "Cadastre a matrícula e os dados principais.",
    resource: "students",
    mode: "create",
    wide: true,
    fields: studentFields,
    success: (saved) => `${saved.name} foi matriculado com sucesso.`,
  },
  "edit-student": {
    title: "Editar aluno",
    subtitle: "Atualize as informações da matrícula.",
    resource: "students",
    mode: "update",
    wide: true,
    fields: studentFields,
    success: () => "Dados do aluno atualizados.",
  },
  "new-class": {
    title: "Agendar aula",
    subtitle: "Reserve horário, professor e sala.",
    resource: "classes",
    mode: "create",
    fields: [
      {
        name: "student",
        label: "Aluno ou turma",
        required: true,
        full: true,
        autoFocus: true,
        placeholder: "Nome do aluno ou da turma",
      },
      { name: "course", label: "Curso", type: "select", required: true, source: resourceOptions("courses") },
      {
        name: "teacher",
        label: "Professor",
        type: "select",
        required: true,
        source: resourceOptions("teachers"),
      },
      {
        name: "day",
        label: "Dia da semana",
        type: "select",
        numeric: true,
        default: () => Math.min(weekdayIndex(), 5),
        options: () =>
          weekDays().map((day) => ({
            value: day.index,
            label: `${day.short} · ${day.day}/${String(day.month + 1).padStart(2, "0")}`,
          })),
      },
      {
        name: "type",
        label: "Tipo",
        type: "select",
        options: ["Individual", "Coletiva"],
        default: "Individual",
      },
      {
        name: "room",
        label: "Sala",
        type: "select",
        source: resourceOptions("rooms"),
        emptyLabel: "Sem sala definida",
      },
      { name: "start", label: "Início", type: "time", required: true },
      { name: "end", label: "Fim", type: "time" },
    ],
    success: (saved) => `Aula de ${saved.student} agendada para ${saved.start}.`,
  },
  "new-group": {
    title: "Nova turma",
    subtitle: "Configure uma nova turma coletiva.",
    resource: "groups",
    mode: "create",
    fields: [
      {
        name: "name",
        label: "Nome da turma",
        required: true,
        full: true,
        autoFocus: true,
        placeholder: "Ex.: Orquestra Iniciante",
      },
      { name: "course", label: "Curso", type: "select", required: true, source: resourceOptions("courses") },
      {
        name: "teacher",
        label: "Professor",
        type: "select",
        required: true,
        source: resourceOptions("teachers"),
      },
      { name: "schedule", label: "Horário", placeholder: "Sábados · 10:00" },
      {
        name: "room",
        label: "Sala",
        type: "select",
        source: resourceOptions("rooms"),
        emptyLabel: "Sem sala definida",
      },
      { name: "capacity", label: "Capacidade", type: "number", min: 1, default: 12 },
      { name: "level", label: "Nível", type: "select", options: LEVELS, default: "Iniciante" },
    ],
    success: (saved) => `Turma ${saved.name} criada.`,
  },
  "new-payment": {
    title: "Lançar cobrança",
    subtitle: "Registre uma nova mensalidade ou receita.",
    resource: "transactions",
    mode: "create",
    fields: [
      {
        name: "studentId",
        label: "Aluno",
        type: "select",
        required: true,
        full: true,
        autoFocus: true,
        numeric: true,
        placeholder: "Selecione o aluno",
        source: resourceOptions("students", "id", "name"),
        sync: { student: "name" },
      },
      {
        name: "description",
        label: "Descrição",
        required: true,
        full: true,
        placeholder: "Mensalidade · Curso",
      },
      {
        name: "amount",
        label: "Valor",
        type: "number",
        required: true,
        min: 0.01,
        step: 0.01,
        placeholder: "0,00",
      },
      { name: "due", label: "Vencimento", type: "date", default: () => defaultDueDate() },
      {
        name: "method",
        label: "Forma de pagamento",
        type: "select",
        options: ["Pix", "Cartão", "Boleto", "Dinheiro"],
        default: "Pix",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["Pendente", "Pago", "Atrasado"],
        default: "Pendente",
      },
    ],
    success: () => "Cobrança registrada no financeiro.",
  },
  "new-evaluation": {
    title: "Nova avaliação",
    subtitle: "Registre a evolução pedagógica do aluno.",
    resource: "evaluations",
    mode: "create",
    fields: [
      {
        name: "studentId",
        label: "Aluno",
        type: "select",
        required: true,
        full: true,
        autoFocus: true,
        numeric: true,
        placeholder: "Selecione o aluno",
        source: resourceOptions("students", "id", "name"),
      },
      { name: "title", label: "Título", required: true, full: true, placeholder: "Ex.: Evolução técnica" },
      { name: "score", label: "Nota (0–10)", type: "number", min: 0, max: 10, step: 0.5, default: 8 },
      { name: "date", label: "Data", type: "date", default: () => toIsoDate() },
      {
        name: "note",
        label: "Observações",
        type: "textarea",
        required: true,
        full: true,
        placeholder: "Descreva avanços, dificuldades e próximos passos.",
      },
    ],
    success: () => "Avaliação pedagógica registrada.",
  },
  "new-notification": {
    title: "Novo comunicado",
    subtitle: "Publique um aviso para a equipe e os alunos.",
    resource: "notifications",
    mode: "create",
    fields: [
      {
        name: "title",
        label: "Título",
        required: true,
        full: true,
        autoFocus: true,
        placeholder: "Ex.: Recesso de fim de ano",
      },
      {
        name: "type",
        label: "Tipo",
        type: "select",
        default: "info",
        options: [
          { value: "info", label: "Informativo" },
          { value: "warning", label: "Alerta" },
          { value: "success", label: "Boa notícia" },
        ],
      },
      {
        name: "text",
        label: "Mensagem",
        type: "textarea",
        required: true,
        full: true,
        placeholder: "Escreva o comunicado.",
      },
    ],
    success: () => "Comunicado publicado.",
  },
};

/** Valores iniciais: padrão do campo, sobrescrito pelos dados do registro em edição. */
export function initialValues(fields, source = {}) {
  return Object.fromEntries(
    fields.map((field) => {
      const fallback = typeof field.default === "function" ? field.default() : field.default;
      return [field.name, source[field.name] ?? fallback ?? ""];
    }),
  );
}

/**
 * Mantém apenas os campos declarados (mais os copiados por `sync`) e converte números.
 * Campos opcionais vazios são omitidos na criação e enviados vazios na edição (para limpar o valor).
 */
export function buildPayload(fields, values, { mode = "create" } = {}) {
  const payload = {};
  for (const field of fields) {
    const value = values[field.name];
    if (value === "" && !field.required && (mode === "create" || field.numeric || field.type === "number"))
      continue;
    payload[field.name] = field.numeric || field.type === "number" ? Number(value) : value;
    for (const target of Object.keys(field.sync ?? {})) payload[target] = values[target];
  }
  return payload;
}
