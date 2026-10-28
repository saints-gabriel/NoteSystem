import { authenticate, loginSchema } from "../auth.js";
export async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const token = await authenticate(email, password);
    if (!token) return res.status(401).json({ error: "E-mail ou senha inválidos." });
    return res.json({ token });
  } catch (error) { return next(error); }
}
export function currentUser(req, res) { return res.json({ user: req.user }); }
