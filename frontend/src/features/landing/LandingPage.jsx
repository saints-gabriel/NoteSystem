import { useState } from "react";
import { AlertTriangle, CalendarDays, CheckCircle2 } from "lucide-react";
import { Field, PageTitle } from "../../components/ui/index.js";
import { createLead } from "../../services/leadService.js";

const EMPTY_FORM = { name: "", email: "", phone: "", instrument: "" };

const FIELDS = [
  { name: "name", label: "Nome completo", full: true },
  { name: "email", label: "E-mail", type: "email" },
  { name: "phone", label: "Telefone", type: "tel" },
  { name: "instrument", label: "Instrumento" },
];

export function LandingPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ state: "sending", message: "" });
    try {
      await createLead(form);
      setForm(EMPTY_FORM);
      setStatus({ state: "sent", message: "Solicitação enviada! Nossa equipe entrará em contato em breve." });
    } catch (error) {
      setStatus({ state: "error", message: error.message });
    }
  };

  return (
    <main className="view landing-page">
      <PageTitle
        eyebrow="NOTE SYSTEM / SITE PÚBLICO"
        title={
          <>
            A música transforma.
            <br />
            <span>Comece sua jornada.</span>
          </>
        }
        description="Agende uma aula experimental e conheça a Oficina V12."
      />
      <section className="panel landing-card">
        <div>
          <span className="panel-kicker">AULA EXPERIMENTAL</span>
          <h2>Descubra seu próximo acorde.</h2>
          <p>Preencha o formulário e nossa equipe entrará em contato para encontrar o melhor horário.</p>
        </div>
        <form className="entity-form" onSubmit={submit}>
          <div className="form-grid">
            {FIELDS.map(({ name, label, type = "text", full }) => (
              <Field key={name} label={label} full={full}>
                <input
                  required
                  type={type}
                  value={form[name]}
                  onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))}
                />
              </Field>
            ))}
          </div>
          {status.state === "sent" && (
            <div className="form-success" role="status">
              <CheckCircle2 size={16} />
              {status.message}
            </div>
          )}
          {status.state === "error" && (
            <div className="form-error" role="alert">
              <AlertTriangle size={16} />
              {status.message}
            </div>
          )}
          <button className="button button-primary" type="submit" disabled={status.state === "sending"}>
            <CalendarDays size={16} />
            {status.state === "sending" ? "Enviando..." : "Solicitar aula"}
          </button>
        </form>
      </section>
    </main>
  );
}
