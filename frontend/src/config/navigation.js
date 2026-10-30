import {
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  ShieldCheck,
  UserRoundCheck,
  Users,
  WalletCards,
} from "lucide-react";
import { ROLES } from "./roles.js";

/**
 * Fonte única da navegação do workspace: alimenta a barra lateral, a busca
 * global e o breadcrumb. `section` abre um novo grupo no menu.
 * `roles` (opcional) restringe o item a certos papéis.
 * Para criar uma nova tela: adicione o item aqui e a rota em `app/AppRoutes.jsx`.
 */
export const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Visão geral",
    subtitle: "Centro de comando",
    icon: LayoutDashboard,
    section: "COMANDO",
  },
  { id: "students", label: "Alunos", subtitle: "Gestão de matrículas", icon: Users, section: "GESTÃO" },
  { id: "schedule", label: "Agenda", subtitle: "Aulas e disponibilidade", icon: CalendarDays },
  { id: "groups", label: "Turmas & cursos", subtitle: "Estrutura acadêmica", icon: GraduationCap },
  { id: "finance", label: "Financeiro", subtitle: "Receitas e mensalidades", icon: WalletCards },
  {
    id: "pedagogy",
    label: "Pedagógico",
    subtitle: "Evolução e repertório",
    icon: BookOpenCheck,
    section: "ANÁLISE",
  },
  { id: "reports", label: "Relatórios", subtitle: "Inteligência do negócio", icon: BarChart3 },
  {
    id: "enrollment",
    label: "Matrículas & responsáveis",
    subtitle: "Cadastro completo",
    icon: UserRoundCheck,
    section: "MÓDULOS",
  },
  { id: "courses", label: "Cursos, turmas & salas", subtitle: "Estrutura e conflitos", icon: GraduationCap },
  {
    id: "pedagogy-hub",
    label: "Acompanhamento pedagógico",
    subtitle: "Conteúdo e repertório",
    icon: BookOpenCheck,
  },
  { id: "finance-hub", label: "Planos & repasses", subtitle: "Operação financeira", icon: WalletCards },
  {
    id: "communication",
    label: "Comunicação & eventos",
    subtitle: "Relacionamento com a comunidade",
    icon: MessageSquareText,
  },
  {
    id: "administration",
    label: "Administração & LGPD",
    subtitle: "Governança do ambiente",
    icon: ShieldCheck,
    roles: [ROLES.ADMIN],
  },
];

export const SETTINGS_ITEM = {
  id: "settings",
  label: "Configurações",
  subtitle: "Preferências do sistema",
  icon: Settings,
};

export const navItemsFor = (role) => NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role));

export const findNavItem = (id) => [...NAV_ITEMS, SETTINGS_ITEM].find((item) => item.id === id);
