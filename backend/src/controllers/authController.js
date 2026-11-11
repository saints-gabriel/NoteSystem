import * as authService from "../services/authService.js";

export const login = async (req, res) => res.json(await authService.login(req.body));

export const currentUser = (req, res) => res.json({ user: req.user });
