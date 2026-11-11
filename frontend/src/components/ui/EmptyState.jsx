import { Search } from "lucide-react";

export function EmptyState({ icon: Icon = Search, title, text, action }) {
  return (
    <div className="empty-state">
      <Icon size={28} />
      <strong>{title}</strong>
      <p>{text}</p>
      {action}
    </div>
  );
}
