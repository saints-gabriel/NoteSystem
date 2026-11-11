import { z } from "zod";
import { toIsoDate } from "../utils/dates.js";

/**
 * Cada recurso define:
 *  - `shape`: campos validados (aceita campos extras: `looseObject`);
 *  - `defaults` (opcional): valores aplicados apenas na criação, podendo
 *    receber o próprio payload para derivar campos (ex.: iniciais).
 * `create` exige os campos obrigatórios; `update` aceita qualquer subconjunto.
 */
const text = z.string().trim().min(1);
const optionalText = z.string().trim().optional();
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato AAAA-MM-DD.");
const optionalEmail = z.union([z.email(), z.literal("")]).optional();
const money = z.coerce.number().positive("Informe um valor maior que zero.");

const initialsOf = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const definitions = {
  students: {
    shape: {
      name: z.string().trim().min(2),
      course: text,
      teacher: text,
      email: optionalEmail,
      phone: optionalText,
      level: z.enum(["Iniciante", "Intermediário", "Avançado"]).optional(),
      status: z.enum(["Ativo", "Pendente", "Inativo"]).optional(),
      attendance: z.coerce.number().min(0).max(100).optional(),
      progress: z.coerce.number().min(0).max(100).optional(),
    },
    defaults: (data) => ({
      initials: initialsOf(data.name),
      level: "Iniciante",
      status: "Ativo",
      attendance: 100,
      progress: 0,
      color: "yellow",
      enrolledAt: toIsoDate(),
    }),
  },
  classes: {
    shape: {
      student: text,
      course: text,
      teacher: text,
      start: z.string().regex(/^\d{2}:\d{2}$/),
      end: z.union([z.string().regex(/^\d{2}:\d{2}$/), z.literal("")]).optional(),
      day: z.coerce.number().int().min(0).max(6).optional(),
      room: optionalText,
      type: z.enum(["Individual", "Coletiva"]).optional(),
      status: z.enum(["Confirmada", "Pendente", "Cancelada"]).optional(),
    },
    defaults: () => ({ day: 0, type: "Individual", status: "Pendente" }),
  },
  groups: {
    shape: {
      name: z.string().trim().min(2),
      course: text,
      teacher: text,
      schedule: optionalText,
      room: optionalText,
      level: z.enum(["Iniciante", "Intermediário", "Avançado"]).optional(),
      capacity: z.coerce.number().int().min(1).optional(),
      students: z.coerce.number().int().min(0).optional(),
    },
    defaults: () => ({ students: 0, capacity: 12, level: "Iniciante" }),
  },
  transactions: {
    shape: {
      student: text,
      studentId: z.coerce.number().int().optional(),
      description: text,
      amount: money,
      due: isoDate.optional(),
      method: z.enum(["Pix", "Cartão", "Boleto", "Dinheiro"]).optional(),
      status: z.enum(["Pago", "Pendente", "Atrasado"]).optional(),
    },
    defaults: () => ({ due: toIsoDate(), method: "Pix", status: "Pendente" }),
  },
  evaluations: {
    shape: {
      studentId: z.coerce.number().int().positive(),
      title: text,
      note: text,
      score: z.coerce.number().min(0).max(10).optional(),
      date: isoDate.optional(),
    },
    defaults: () => ({ score: 8, date: toIsoDate() }),
  },
  notifications: {
    shape: {
      title: text,
      text,
      type: z.enum(["info", "warning", "success"]).optional(),
      read: z.boolean().optional(),
    },
    defaults: () => ({ type: "info", read: false, createdAt: new Date().toISOString() }),
  },
  events: {
    shape: { title: text, date: isoDate, location: optionalText, description: optionalText },
  },
  leads: {
    shape: { status: z.enum(["new", "contacted", "enrolled", "lost"]).optional() },
  },
  courses: {
    shape: { name: text, category: optionalText, monthlyFee: money.optional() },
  },
  rooms: {
    shape: { name: text, capacity: z.coerce.number().int().min(1).optional(), equipment: optionalText },
  },
  teachers: {
    shape: {
      name: z.string().trim().min(2),
      email: optionalEmail,
      courses: z.array(text).optional(),
      commissionRate: z.coerce.number().min(0).max(1).optional(),
    },
    defaults: () => ({ courses: [], commissionRate: 0.45 }),
  },
  plans: {
    shape: {
      name: text,
      description: optionalText,
      price: z.coerce.number().min(0).optional(),
      discount: z.coerce.number().min(0).max(100).optional(),
    },
  },
  audit: { shape: {} },
};

function buildSchemas({ shape, defaults }) {
  const object = z.looseObject(shape);
  return {
    create: defaults ? object.transform((data) => ({ ...defaults(data), ...stripUndefined(data) })) : object,
    update: z.looseObject(shape).partial(),
  };
}

function stripUndefined(data) {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
}

export const resourceSchemas = Object.fromEntries(
  Object.entries(definitions).map(([name, definition]) => [name, buildSchemas(definition)]),
);
