import { useEffect, useRef } from "react";
import { ArrowDownRight, ArrowUpRight, Check, ChevronRight, Music2, Search, X } from "lucide-react";

export function Logo({ compact = false }) {
  return <div className={`brand ${compact ? "brand-compact" : ""}`}><span className="brand-mark" aria-hidden="true"><Music2 size={22} strokeWidth={2.2} /><i className="brand-node node-a" /><i className="brand-node node-b" /></span>{!compact && <span className="brand-type"><strong>NOTE<span>SYSTEM</span></strong><small>INTELLIGENT SCHOOL OS</small></span>}</div>;
}
export function Badge({ children, tone = "neutral", dot = false }) { return <span className={`badge badge-${tone}`}>{dot && <i />}{children}</span>; }
export function Avatar({ student, size = "md" }) { return <span className={`avatar avatar-${student.color || "yellow"} avatar-${size}`}>{student.initials || student.name?.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span>; }
export function ProgressBar({ value, tone = "yellow", label }) { return <div className="progress-wrap" aria-label={label || `${value}%`}><div className="progress-track"><span className={`progress-${tone}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>{label && <small>{label}</small>}</div>; }
export function PageTitle({ eyebrow, title, description, actions }) { return <div className="page-title"><div><span className="eyebrow"><i />{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="page-actions">{actions}</div>}</div>; }
export function StatCard({ label, value, delta, icon: Icon, tone = "yellow", detail, down = false }) { return <article className={`stat-card border-glow-${tone}`}><div className="stat-top"><span className={`stat-icon text-${tone}`}><Icon size={19} /></span><Badge tone={down ? "red" : "green"}>{down ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}{delta}</Badge></div><strong className="stat-value">{value}</strong><span className="stat-label">{label}</span><div className="stat-detail">{detail}</div></article>; }
export function EmptyState({ icon: Icon = Search, title, text, action }) { return <div className="empty-state"><Icon size={28} /><strong>{title}</strong><p>{text}</p>{action}</div>; }
export function Modal({ title, subtitle, children, onClose, wide = false }) {
  const panelRef = useRef(null);
  useEffect(() => { const previous = document.activeElement; panelRef.current?.focus(); const handler = (event) => { if (event.key === "Escape") onClose(); }; document.addEventListener("keydown", handler); return () => { document.removeEventListener("keydown", handler); previous?.focus?.(); }; }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className={`modal-panel ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={panelRef}><header><div><span className="eyebrow"><i />NOTE / INPUT</span><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Fechar"><X size={19} /></button></header>{children}</section></div>;
}
export function Field({ label, children, full = false, hint }) { return <label className={`field ${full ? "field-full" : ""}`}><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>; }
export function downloadFile(name, content, type) { const blob = new Blob([content], { type: `${type};charset=utf-8` }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
