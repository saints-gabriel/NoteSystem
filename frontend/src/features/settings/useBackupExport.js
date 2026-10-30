import { useCallback } from "react";
import { useToast } from "../../context/ToastContext.jsx";
import { getBackup } from "../../services/adminService.js";
import { downloadFile } from "../../utils/download.js";

/** Baixa o backup completo (JSON) gerado pela API; restrito a administradores. */
export function useBackupExport() {
  const { showToast } = useToast();
  return useCallback(async () => {
    try {
      downloadFile("notesystem-backup.json", JSON.stringify(await getBackup(), null, 2), "application/json");
      showToast("Backup JSON exportado.");
    } catch (error) {
      showToast(error.message, "error");
    }
  }, [showToast]);
}
