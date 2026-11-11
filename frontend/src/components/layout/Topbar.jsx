import { useState } from "react";
import { ChevronRight, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { findNavItem } from "../../config/navigation.js";
import { GlobalSearch } from "./GlobalSearch.jsx";
import { NotificationsPopover } from "./NotificationsPopover.jsx";
import { ProfileMenu } from "./ProfileMenu.jsx";

export function Topbar({ onOpenMenu }) {
  const { pathname } = useLocation();
  const [popover, setPopover] = useState(null);
  const toggle = (name) => () => setPopover((current) => (current === name ? null : name));
  const close = () => setPopover(null);

  return (
    <header className="topbar">
      <button className="icon-button menu-trigger" onClick={onOpenMenu} aria-label="Abrir menu">
        <Menu size={20} />
      </button>
      <div className="breadcrumb">
        <span>NoteSystem</span>
        <ChevronRight size={13} />
        <strong>{findNavItem(pathname.split("/")[1])?.label ?? "Início"}</strong>
      </div>
      <div className="topbar-actions">
        <GlobalSearch />
        <NotificationsPopover
          open={popover === "notifications"}
          onToggle={toggle("notifications")}
          onClose={close}
        />
        <ProfileMenu open={popover === "profile"} onToggle={toggle("profile")} onClose={close} />
      </div>
    </header>
  );
}
