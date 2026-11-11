import { User } from "../models/index.js";

export const findUserByEmail = (email) => User.findOne({ where: { email } });

export async function ensureUser({ name, email, passwordHash, role }) {
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: { name, passwordHash, role },
  });
  return { user, created };
}
