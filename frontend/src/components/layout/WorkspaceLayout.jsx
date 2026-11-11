import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ResourceProvider } from "../../context/ResourceContext.jsx";
import { WorkspaceUiProvider } from "../../context/WorkspaceUiContext.jsx";
import { AssistantDrawer } from "../../features/assistant/AssistantDrawer.jsx";
import { FormModalHost } from "../../features/forms/FormModalHost.jsx";
import { StudentDrawer } from "../../features/students/StudentDrawer.jsx";
import { useKeydown } from "../../hooks/useKeydown.js";
import { Sidebar } from "./Sidebar.jsx";
import { Topbar } from "./Topbar.jsx";

/** Casca do workspace (admin/professor): navegação, páginas filhas e painéis globais. */
export function WorkspaceLayout() {
  return (
    <ResourceProvider>
      <WorkspaceUiProvider>
        <Shell />
      </WorkspaceUiProvider>
    </ResourceProvider>
  );
}

function Shell() {
  const [mobileNav, setMobileNav] = useState(false);
  useKeydown((event) => event.key === "Escape" && setMobileNav(false));

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      {mobileNav && (
        <button className="nav-scrim" aria-label="Fechar menu" onClick={() => setMobileNav(false)} />
      )}
      <Sidebar open={mobileNav} onClose={() => setMobileNav(false)} />
      <div className="main-column">
        <Topbar onOpenMenu={() => setMobileNav(true)} />
        <main id="main-content">
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>NOTE SYSTEM © 2026</span>
          <span>
            <i />
            API CONECTADA
          </span>
        </footer>
      </div>
      <StudentDrawer />
      <AssistantDrawer />
      <FormModalHost />
    </div>
  );
}
