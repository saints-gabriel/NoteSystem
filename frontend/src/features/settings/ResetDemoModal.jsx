import { useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Modal } from "../../components/ui/index.js";
import { useToast } from "../../context/ToastContext.jsx";
import { resetDemoData } from "../../services/adminService.js";

export function ResetDemoModal({ onClose }) {
  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);

  const reset = async () => {
    setBusy(true);
    try {
      await resetDemoData();
      window.location.assign("/dashboard"); // recarrega para descartar o cache de dados
    } catch (error) {
      showToast(error.message, "error");
      setBusy(false);
    }
  };

  return (
    <Modal
      title="Restaurar demonstração?"
      subtitle="Esta ação substitui todos os dados pelos registros originais."
      onClose={onClose}
    >
      <div className="confirm-content">
        <AlertTriangle size={30} />
        <p>Exporte um backup antes se quiser preservar as alterações feitas.</p>
      </div>
      <footer className="modal-actions">
        <button className="button button-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button className="button button-danger" onClick={reset} disabled={busy}>
          <RotateCcw size={16} />
          {busy ? "Restaurando..." : "Sim, restaurar"}
        </button>
      </footer>
    </Modal>
  );
}
