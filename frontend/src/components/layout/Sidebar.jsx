import { BrainCircuit, ChevronDown, ChevronRight, Settings, Sparkles, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { SETTINGS_ITEM, navItemsFor } from "../../config/navigation.js";
import { useResource } from "../../context/ResourceContext.jsx";
import { useSession } from "../../context/SessionContext.jsx";
import { useWorkspaceUi } from "../../context/WorkspaceUiContext.jsx";
import { Logo } from "../ui/index.js";

export function Sidebar({ open, onClose }) {
  const { user } = useSession();
  const { assistantOpen, openAssistant } = useWorkspaceUi();
  const transactions = useResource("transactions");
  const hasOverdue = transactions.items.some((item) => item.status === "Atrasado");

  return (
    <aside className={`sidebar ${open ? "mobile-open" : ""}`}>
      <div className="sidebar-brand">
        <Logo />
        <button className="icon-button mobile-close" onClick={onClose} aria-label="Fechar menu">
          <X size={19} />
        </button>
      </div>
      <NavLink className="workspace-switch" to="/settings" onClick={onClose}>
        <span className="workspace-emblem">V12</span>
        <span>
          <strong>Oficina V12</strong>
          <small>ESCOLA DE MÚSICA</small>
        </span>
        <ChevronDown size={15} />
      </NavLink>
      <nav className="main-nav" aria-label="Navegação principal">
        {navItemsFor(user.role).map((item) => (
          <div key={item.id}>
            {item.section && <span className="nav-section">{item.section}</span>}
            <NavLink
              to={`/${item.id}`}
              onClick={onClose}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {item.id === "finance" && hasOverdue && <i className="nav-alert" />}
                  {isActive && <ChevronRight size={14} className="nav-active-arrow" />}
                </>
              )}
            </NavLink>
          </div>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button className={`assistant-trigger ${assistantOpen ? "active" : ""}`} onClick={openAssistant}>
          <span className="assistant-symbol">
            <BrainCircuit size={20} />
            <i />
          </span>
          <span>
            <strong>Assistente N.O.T.E.</strong>
            <small>INTELIGÊNCIA OPERACIONAL</small>
          </span>
          <Sparkles size={16} />
        </button>
        <NavLink
          to={`/${SETTINGS_ITEM.id}`}
          onClick={onClose}
          className={({ isActive }) => `settings-link ${isActive ? "active" : ""}`}
        >
          <Settings size={18} />
          {SETTINGS_ITEM.label}
        </NavLink>
        <div className="system-status">
          <span>
            <i />
            SISTEMA OPERACIONAL
          </span>
          <small>v1.0.0 · API CONECTADA</small>
        </div>
      </div>
    </aside>
  );
}
