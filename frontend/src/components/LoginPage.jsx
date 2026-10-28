import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getCurrentUser } from "../services/api.js";
import { Field, Logo, PageTitle } from "./ui.jsx";

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    try {
      const { token } = await api.login(form);
      localStorage.setItem("notesystem-token", token);
      const user = getCurrentUser();
      navigate(user?.role === "admin" ? "/dashboard" : user?.role === "teacher" ? "/pedagogy-hub" : "/student-home");
    } catch (requestError) { setError(requestError.message); }
  };
  return <main className="view" style={{ maxWidth: 480, margin: "10vh auto" }}><section className="panel settings-panel"><Logo /><PageTitle eyebrow="ACESSO / NOTE SYSTEM" title="Entrar" description="Acesse seu ambiente da Oficina V12." /><form className="entity-form" onSubmit={submit}><Field label="E-mail"><input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></Field><Field label="Senha"><input type="password" required minLength={6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></Field>{error && <p className="text-red">{error}</p>}<button className="button button-primary" type="submit">Entrar</button></form><p style={{ marginTop: 20 }}>Ainda não conhece a escola? <a href="/landing" className="text-button">Agende uma aula experimental</a></p></section></main>;
}
