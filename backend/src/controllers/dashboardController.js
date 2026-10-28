import { findAllRecords } from "../models/recordModel.js";
export async function dashboard(_req, res, next) {
  try {
    const [students, classes, transactions, notifications] = await Promise.all(["students", "classes", "transactions", "notifications"].map(findAllRecords));
    return res.json({ students, classes, transactions, notifications });
  } catch (error) { return next(error); }
}
