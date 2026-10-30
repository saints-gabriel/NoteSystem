import bcrypt from "bcrypt";
import { findUserByEmail } from "../repositories/userRepository.js";
import { unauthorized } from "../utils/httpError.js";
import { signToken } from "../utils/token.js";

export async function login({ email, password }) {
  const user = await findUserByEmail(email);
  const valid = user && (await bcrypt.compare(password, user.passwordHash));
  if (!valid) throw unauthorized("E-mail ou senha inválidos.");
  return { token: signToken(user) };
}
