import { weekdayIndex } from "../utils/dates.js";

const WEEKDAY_SHORT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const pad = (value) => String(value).padStart(2, "0");

export const timeOf = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export const sortByStart = (classes) => [...classes].sort((a, b) => a.start.localeCompare(b.start));

export const classesOnDay = (classes, day) => sortByStart(classes.filter((item) => item.day === day));

/** Texto da próxima aula do aluno ("Hoje, 14:30", "Amanhã, 10:00", "Sex, 19:00"). */
export function nextClassLabel(studentName, classes, now = new Date()) {
  const today = weekdayIndex(now);
  const currentTime = timeOf(now);
  const upcoming = classes
    .filter((item) => item.student === studentName)
    .map((item) => {
      const offset = (item.day - today + 7) % 7;
      return { item, offset: offset === 0 && item.start <= currentTime ? 7 : offset };
    })
    .sort((a, b) => a.offset - b.offset || a.item.start.localeCompare(b.item.start))[0];

  if (!upcoming) return "Sem aula agendada";
  const { item, offset } = upcoming;
  const day = offset === 0 ? "Hoje" : offset === 1 ? "Amanhã" : WEEKDAY_SHORT[item.day];
  return `${day}, ${item.start}`;
}

export const withNextClass = (students, classes, now = new Date()) =>
  students.map((student) => ({ ...student, nextClass: nextClassLabel(student.name, classes, now) }));
