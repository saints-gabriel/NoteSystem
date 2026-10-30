import { useState } from "react";
import { AlertTriangle, Bell, CheckCircle2, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useResource } from "../../context/ResourceContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useKeydown } from "../../hooks/useKeydown.js";
import { formatTimeAgo } from "../../utils/format.js";

const ICONS = { warning: AlertTriangle, info: Info, success: CheckCircle2 };
const DESTINATIONS = { warning: "/finance", info: "/schedule" };

export function NotificationsPopover({ open, onToggle, onClose }) {
  const notifications = useResource("notifications");
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  useKeydown((event) => event.key === "Escape" && onClose());

  const unread = notifications.items.filter((item) => !item.read);
  const items = [...notifications.items].reverse();

  const markRead = (notification) =>
    notification.read || notifications.update(notification.id, { read: true });

  const markAllRead = async () => {
    setBusy(true);
    try {
      await Promise.all(unread.map(markRead));
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const open_ = async (notification) => {
    onClose();
    if (DESTINATIONS[notification.type]) navigate(DESTINATIONS[notification.type]);
    try {
      await markRead(notification);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="popover-anchor">
      <button
        className="icon-button notification-button"
        onClick={onToggle}
        aria-label={`Notificações, ${unread.length} não lidas`}
      >
        <Bell size={19} />
        {unread.length > 0 && <i>{unread.length}</i>}
      </button>
      {open && (
        <div className="popover notifications-popover">
          <header>
            <div>
              <span className="panel-kicker">CENTRAL DE AVISOS</span>
              <h3>Notificações</h3>
            </div>
            {unread.length > 0 && (
              <button onClick={markAllRead} disabled={busy}>
                Marcar como lidas
              </button>
            )}
          </header>
          <div>
            {items.map((notification) => {
              const Icon = ICONS[notification.type] ?? Info;
              return (
                <button
                  key={notification.id}
                  className={!notification.read ? "unread" : ""}
                  onClick={() => open_(notification)}
                >
                  <span className={`notification-icon notification-${notification.type}`}>
                    <Icon size={17} />
                  </span>
                  <span>
                    <strong>{notification.title}</strong>
                    <p>{notification.text}</p>
                    <small>{formatTimeAgo(notification.createdAt)} atrás</small>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
