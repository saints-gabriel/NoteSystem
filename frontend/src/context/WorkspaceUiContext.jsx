import { createContext, useCallback, useContext, useMemo, useState } from "react";

/** Estado de interface compartilhado pelo workspace: modais e painéis laterais. */
const WorkspaceUiContext = createContext(null);

export function WorkspaceUiProvider({ children }) {
  const [form, setForm] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assistantOpen, setAssistantOpen] = useState(false);

  const value = useMemo(
    () => ({
      form,
      openForm: (type, data = null) => setForm({ type, data }),
      closeForm: () => setForm(null),
      selectedStudent,
      openStudent: setSelectedStudent,
      closeStudent: () => setSelectedStudent(null),
      assistantOpen,
      openAssistant: () => setAssistantOpen(true),
      closeAssistant: () => setAssistantOpen(false),
    }),
    [form, selectedStudent, assistantOpen],
  );

  return <WorkspaceUiContext.Provider value={value}>{children}</WorkspaceUiContext.Provider>;
}

export function useWorkspaceUi() {
  const context = useContext(WorkspaceUiContext);
  if (!context) throw new Error("useWorkspaceUi deve ser usado dentro de <WorkspaceUiProvider>.");
  return context;
}
