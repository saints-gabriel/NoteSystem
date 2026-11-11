import { Music2 } from "lucide-react";

export function Logo({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <span className="brand-mark" aria-hidden="true">
        <Music2 size={22} strokeWidth={2.2} />
        <i className="brand-node node-a" />
        <i className="brand-node node-b" />
      </span>
      {!compact && (
        <span className="brand-type">
          <strong>
            NOTE<span>SYSTEM</span>
          </strong>
          <small>INTELLIGENT SCHOOL OS</small>
        </span>
      )}
    </div>
  );
}
