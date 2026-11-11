import * as records from "../repositories/recordRepository.js";
import { ROLES } from "../constants/roles.js";
import { withNextClass } from "./scheduleService.js";

const same = (a, b) => a?.toLowerCase() === b?.toLowerCase();

function findStudentOf(user, students) {
  return students.find((item) => same(item.email, user.email) || same(item.name, user.name));
}

function studentPortal(user, { students, classes, transactions, evaluations }) {
  const student = findStudentOf(user, students);
  const studentName = student?.name ?? user.name;
  const fallback = { name: user.name, email: user.email, status: "Ativo", attendance: 0, progress: 0 };
  return {
    user,
    student: student ?? fallback,
    classes: classes.filter((item) => same(item.student, studentName)),
    transactions: transactions.filter((item) => same(item.student, studentName)),
    evaluations: evaluations.filter((item) => student && item.studentId === student.id),
  };
}

function staffPortal(user, { students, classes, transactions, evaluations }) {
  const ownedByTeacher = (item) => user.role !== ROLES.TEACHER || same(item.teacher, user.name);
  return {
    user,
    students: students.filter(ownedByTeacher),
    classes: classes.filter(ownedByTeacher),
    transactions,
    evaluations,
  };
}

export async function getPortal(user) {
  const [students, classes, transactions, evaluations] = await Promise.all([
    records.findAll("students"),
    records.findAll("classes"),
    records.findAll("transactions"),
    records.findAll("evaluations"),
  ]);
  const data = { students: withNextClass(students, classes), classes, transactions, evaluations };
  return user.role === ROLES.STUDENT ? studentPortal(user, data) : staffPortal(user, data);
}
