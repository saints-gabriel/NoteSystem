import { useResource } from "../../context/ResourceContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useWorkspaceUi } from "../../context/WorkspaceUiContext.jsx";
import { EntityFormModal } from "./EntityFormModal.jsx";
import { FORMS } from "./formConfigs.js";

function FormModal({ config, data, onClose }) {
  const resource = useResource(config.resource);
  const { openStudent } = useWorkspaceUi();
  const { showToast } = useToast();

  const submit = async (payload) => {
    const saved =
      config.mode === "update" ? await resource.update(data.id, payload) : await resource.create(payload);
    if (config.resource === "students" && config.mode === "update") openStudent(saved);
    showToast(config.success(saved));
    onClose();
  };

  return <EntityFormModal config={config} data={data} onClose={onClose} onSubmit={submit} />;
}

/** Renderiza o formulário aberto via `openForm(type, data)` do contexto do workspace. */
export function FormModalHost() {
  const { form, closeForm } = useWorkspaceUi();
  const config = form && FORMS[form.type];
  if (!config) return null;
  return <FormModal key={form.type} config={config} data={form.data} onClose={closeForm} />;
}
