import { useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import { Modal } from "../../components/ui/index.js";
import { FormField } from "./FormField.jsx";
import { buildPayload, initialValues } from "./formConfigs.js";

/** Modal genérico: renderiza os campos de `config`, valida os obrigatórios e devolve o payload. */
export function EntityFormModal({ config, data, onClose, onSubmit }) {
  const [values, setValues] = useState(() => initialValues(config.fields, data ?? {}));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const change = (changes) => setValues((current) => ({ ...current, ...changes }));

  const submit = async (event) => {
    event.preventDefault();
    const missing = config.fields.some((field) => field.required && !String(values[field.name] ?? "").trim());
    if (missing) return setError("Preencha todos os campos obrigatórios para continuar.");

    setSaving(true);
    try {
      await onSubmit(buildPayload(config.fields, values, { mode: config.mode }));
    } catch (requestError) {
      setError(requestError.message);
      setSaving(false);
    }
  };

  return (
    <Modal title={config.title} subtitle={config.subtitle} onClose={onClose} wide={config.wide}>
      <form onSubmit={submit} className="entity-form">
        <div className="form-grid">
          {config.fields.map((field) => (
            <FormField key={field.name} field={field} values={values} onChange={change} />
          ))}
        </div>
        {error && (
          <div className="form-error" role="alert">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}
        <footer className="modal-actions">
          <button type="button" className="button button-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="button button-primary" type="submit" disabled={saving}>
            <Check size={17} />
            {saving ? "Salvando..." : "Salvar registro"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
