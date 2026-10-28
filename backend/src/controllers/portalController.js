import { findAllRecords } from "../models/recordModel.js";

export async function portal(req, res, next) {
  try {
    const [students, classes, transactions, evaluations] = await Promise.all(["students", "classes", "transactions", "evaluations"].map(findAllRecords));
    const name = req.user.name.toLowerCase();
    const student = students.find((item) => item.email?.toLowerCase() === req.user.email.toLowerCase() || item.name?.toLowerCase() === name);
    if (req.user.role === "student") {
      const studentName = student?.name || req.user.name;
      return res.json({
        user: req.user,
        student: student || { name: req.user.name, email: req.user.email, status: "Ativo", attendance: 0, progress: 0 },
        classes: classes.filter((item) => item.student?.toLowerCase() === studentName.toLowerCase()),
        transactions: transactions.filter((item) => item.student?.toLowerCase() === studentName.toLowerCase()),
        evaluations: evaluations.filter((item) => item.studentId === student?.id),
      });
    }
    return res.json({
      user: req.user,
      students: req.user.role === "teacher" ? students.filter((item) => item.teacher?.toLowerCase() === name) : students,
      classes: req.user.role === "teacher" ? classes.filter((item) => item.teacher?.toLowerCase() === name) : classes,
      transactions,
      evaluations,
    });
  } catch (error) { return next(error); }
}
