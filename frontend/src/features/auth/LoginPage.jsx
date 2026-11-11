import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Field, Logo, PageTitle } from "../../components/ui/index.js";
import { homePathFor } from "../../config/roles.js";
import { useSession } from "../../context/SessionContext.jsx";

export function LoginPage() {
  const navigate = useNavigate();
  const { user, signIn } = useSession();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={homePathFor(user.role)} replace />;

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const signedIn = await signIn(form);
      navigate(homePathFor(signedIn.role), { replace: true });
    } catch (requestError) {
      setError(requestError.message);
      setSubmitting(false);
    }
  };

  return (
    <main className="view" style={{ maxWidth: 480, margin: "10vh auto" }}>
      <section className="panel settings-panel">
        <Logo />
        <PageTitle
          eyebrow="ACESSO / NOTE SYSTEM"
          title="Entrar"
          description="Acesse seu ambiente da Oficina V12."
        />
        <form className="entity-form" onSubmit={submit}>
          <Field label="E-mail">
            <input type="email" required value={form.email} onChange={update("email")} />
          </Field>
          <Field label="Senha">
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={update("password")}
            />
          </Field>
          {error && <p className="text-red">{error}</p>}
          <button className="button button-primary" type="submit" disabled={submitting}>
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p style={{ marginTop: 20 }}>
          Ainda não conhece a escola?{" "}
          <a href="/landing" className="text-button">
            Agende uma aula experimental
          </a>
        </p>
      </section>
    </main>
  );
}
