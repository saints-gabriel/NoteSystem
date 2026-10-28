import { z } from "zod";
import { insertRecord } from "../models/recordModel.js";

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  instrument: z.string().min(2),
});

export async function createLead(req, res, next) {
  try {
    const lead = await insertRecord("leads", { ...leadSchema.parse(req.body), status: "new", createdAt: new Date().toISOString() });
    return res.status(201).json(lead);
  } catch (error) { return next(error); }
}
