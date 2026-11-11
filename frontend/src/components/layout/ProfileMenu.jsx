import { ChevronDown, Download, Settings, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../config/roles.js";
import { useSession } from "../../context/SessionContext.jsx";
import { useKeydown } from "../../hooks/useKeydown.js";
import { useBackupExport } from "../../features/settings/useBackupExport.js";
import { initialsOf } from "../../utils/format.js";

export function ProfileMenu({ open, onToggle, onClose }) {
  const { user, signOut } = useSession();
  const exportBackup = useBackupExport();
  const navigate = useNavigate();
  useKeydown((event) => event.key === "Escape" && onClose());

  const run = (action) => () => {
    onClose();
    action();
  };

  return (
    <div className="popover-anchor">
      <button className="profile-button" onClick={onToggle} aria-label="Abrir menu do perfil">
        <span>{initialsOf(user.name)}</span>
        <div>
          <strong>{user.name}</strong>
          <small>{user.role.toUpperCase()}</small>
        </div>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="popover profile-popover">
          <button onClick={run(() => navigate("/settings"))}>
            <Settings size={16} />
            Preferências da conta
          </button>
          {user.role === ROLES.ADMIN && (
            <button onClick={run(exportBackup)}>
              <Download size={16} />
              Exportar meus dados
            </button>
          )}
          <button onClick={run(signOut)}>
            <X size={16} />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
