import { Activity, CalendarDays, TrendingUp, UserRoundCheck } from "lucide-react";

export const REPORT_TYPES = [
  {
    id: "executive",
    name: "Visão executiva",
    icon: Activity,
    desc: "Indicadores essenciais da operação e crescimento.",
  },
  {
    id: "financial",
    name: "Desempenho financeiro",
    icon: TrendingUp,
    desc: "Receita, ticket médio e inadimplência.",
  },
  {
    id: "attendance",
    name: "Frequência & retenção",
    icon: UserRoundCheck,
    desc: "Presença, evasão e engajamento dos alunos.",
  },
  {
    id: "schedule",
    name: "Ocupação da agenda",
    icon: CalendarDays,
    desc: "Uso de salas, horários e disponibilidade docente.",
  },
];

export const REPORT_PERIODS = [
  { id: "30d", label: "Últimos 30 dias" },
  { id: "90d", label: "Últimos 90 dias" },
  { id: "year", label: "Ano corrente" },
];
