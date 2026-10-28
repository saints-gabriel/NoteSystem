import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight,
  BarChart3, Bell, BookOpenCheck, Bot, BrainCircuit, CalendarDays,
  CalendarPlus, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  CircleDollarSign, Clock3, Command, CreditCard, Database, Download,
  FileText, Filter, GraduationCap, Guitar, Info, LayoutDashboard, Mail,
  MapPin, Menu, MessageSquareText, Mic2, Music2, Pencil, Phone, Piano,
  Plus, RotateCcw, Save, Search, Send, Settings, ShieldCheck, Sparkles,
  Target, TrendingUp, UserPlus, UserRoundCheck, Users, WalletCards, X, Zap,
} from "lucide-react";
import {
  initialClasses, initialEvaluations, initialGroups, initialNotifications,
  initialStudents, initialTransactions, revenueSeries, weekdays,
} from "./data/demo.js";

const NAV_ITEMS = [
  { id: "dashboard", label: "Visão geral", icon: LayoutDashboard, section: "COMANDO" },
  { id: "students", label: "Alunos", icon: Users, section: "GESTÃO" },
  { id: "schedule", label: "Agenda", icon: CalendarDays },
  { id: "groups", label: "Turmas & cursos", icon: GraduationCap },
  { id: "finance", label: "Financeiro", icon: WalletCards },
  { id: "pedagogy", label: "Pedagógico", icon: BookOpenCheck, section: "ANÁLISE" },
  { id: "reports", label: "Relatórios", icon: BarChart3 },
];

const VIEW_META = {
  dashboard: ["Visão geral", "Centro de comando"],
  students: ["Alunos", "Gestão de matrículas"],
  schedule: ["Agenda", "Aulas e disponibilidade"],
  groups: ["Turmas & cursos", "Estrutura acadêmica"],
  finance: ["Financeiro", "Receitas e mensalidades"],
  pedagogy: ["Pedagógico", "Evolução e repertório"],
  reports: ["Relatórios", "Inteligência do negócio"],
  settings: ["Configurações", "Preferências do sistema"],
};

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch { return fallback; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  }, [key, value]);
  return [value, setValue];
}

function Logo({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <span className="brand-mark" aria-hidden="true">
        <Music2 size={22} strokeWidth={2.2} />
        <i className="brand-node node-a" /><i className="brand-node node-b" />
      </span>
      {!compact && <span className="brand-type"><strong>NOTE<span>SYSTEM</span></strong><small>INTELLIGENT SCHOOL OS</small></span>}
    </div>
  );
}

function Badge({ children, tone = "neutral", dot = false }) {
  return <span className={`badge badge-${tone}`}>{dot && <i />}{children}</span>;
}

function Avatar({ student, size = "md" }) {
  return <span className={`avatar avatar-${student.color || "yellow"} avatar-${size}`}>{student.initials || student.name?.split(" ").map(n => n[0]).slice(0, 2).join("")}</span>;
}

function ProgressBar({ value, tone = "yellow", label }) {
  return (
    <div className="progress-wrap" aria-label={label || `${value}%`}>
      <div className="progress-track"><span className={`progress-${tone}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>
      {label && <small>{label}</small>}
    </div>
  );
}

function PageTitle({ eyebrow, title, description, actions }) {
  return (
    <div className="page-title">
      <div><span className="eyebrow"><i />{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

function StatCard({ label, value, delta, icon: Icon, tone = "yellow", detail, down = false }) {
  return (
    <article className={`stat-card border-glow-${tone}`}>
      <div className="stat-top"><span className={`stat-icon text-${tone}`}><Icon size={19} /></span><Badge tone={down ? "red" : "green"}>{down ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}{delta}</Badge></div>
      <strong className="stat-value">{value}</strong><span className="stat-label">{label}</span>
      <div className="stat-detail">{detail}</div>
    </article>
  );
}

function EmptyState({ icon: Icon = Search, title, text, action }) {
  return <div className="empty-state"><Icon size={28} /><strong>{title}</strong><p>{text}</p>{action}</div>;
}

function Modal({ title, subtitle, children, onClose, wide = false }) {
  const panelRef = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    panelRef.current?.focus();
    const handler = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll('button, input, select, textarea, [tabindex="0"]');
        if (!nodes.length) return;
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handler);
    return () => { document.removeEventListener("keydown", handler); previous?.focus?.(); };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <section className={`modal-panel ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={panelRef}>
        <header><div><span className="eyebrow"><i />NOTE / INPUT</span><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Fechar"><X size={19} /></button></header>
        {children}
      </section>
    </div>
  );
}

function Field({ label, children, full = false, hint }) {
  return <label className={`field ${full ? "field-full" : ""}`}><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}

function EntityModal({ modal, students, onClose, onSubmit }) {
  const type = modal.type;
  const source = modal.data || {};
  const [form, setForm] = useState(() => ({ ...source }));
  const [error, setError] = useState("");
  const config = {
    "new-student": ["Novo aluno", "Cadastre a matrícula e os dados principais."],
    "edit-student": ["Editar aluno", "Atualize as informações da matrícula."],
    "new-class": ["Agendar aula", "Reserve horário, professor e sala."],
    "new-group": ["Nova turma", "Configure uma nova turma coletiva."],
    "new-payment": ["Lançar cobrança", "Registre uma nova mensalidade ou receita."],
    "new-evaluation": ["Nova avaliação", "Registre a evolução pedagógica do aluno."],
  };
  const [title, subtitle] = config[type] || ["Novo registro", "Preencha os dados abaixo."];
  const update = (key, value) => setForm(old => ({ ...old, [key]: value }));
  const submit = (e) => {
    e.preventDefault();
    const required = {
      "new-student": ["name", "course", "teacher"], "edit-student": ["name", "course", "teacher"],
      "new-class": ["student", "course", "teacher", "start"], "new-group": ["name", "course", "teacher"],
      "new-payment": ["student", "description", "amount"], "new-evaluation": ["studentId", "title", "note"],
    }[type] || [];
    if (required.some(key => !String(form[key] ?? "").trim())) { setError("Preencha todos os campos obrigatórios para continuar."); return; }
    if (type === "new-payment" && Number(form.amount) <= 0) { setError("Informe um valor maior que zero."); return; }
    onSubmit(type, form);
  };
  return (
    <Modal title={title} subtitle={subtitle} onClose={onClose} wide={type === "new-student" || type === "edit-student"}>
      <form onSubmit={submit} className="entity-form">
        <div className="form-grid">
          {(type === "new-student" || type === "edit-student") && <>
            <Field label="Nome completo *" full><input autoFocus value={form.name || ""} onChange={e => update("name", e.target.value)} placeholder="Ex.: Marina Silva" /></Field>
            <Field label="E-mail"><input type="email" value={form.email || ""} onChange={e => update("email", e.target.value)} placeholder="aluno@email.com" /></Field>
            <Field label="Telefone"><input value={form.phone || ""} onChange={e => update("phone", e.target.value)} placeholder="(00) 00000-0000" /></Field>
            <Field label="Curso *"><select value={form.course || ""} onChange={e => update("course", e.target.value)}><option value="">Selecione</option>{["Piano","Violão","Guitarra","Canto","Bateria","Violino","Baixo","Musicalização"].map(x => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Professor *"><select value={form.teacher || ""} onChange={e => update("teacher", e.target.value)}><option value="">Selecione</option>{["Ana Ribeiro","Rafael Costa","Marina Lopes","Diego Santos"].map(x => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Nível"><select value={form.level || "Iniciante"} onChange={e => update("level", e.target.value)}><option>Iniciante</option><option>Intermediário</option><option>Avançado</option></select></Field>
            <Field label="Status"><select value={form.status || "Ativo"} onChange={e => update("status", e.target.value)}><option>Ativo</option><option>Pendente</option><option>Inativo</option></select></Field>
          </>}
          {type === "new-class" && <>
            <Field label="Aluno ou turma *" full><input autoFocus value={form.student || ""} onChange={e => update("student", e.target.value)} placeholder="Nome do aluno ou da turma" /></Field>
            <Field label="Curso *"><select value={form.course || ""} onChange={e => update("course", e.target.value)}><option value="">Selecione</option>{["Piano","Violão","Guitarra","Canto","Bateria","Violino","Baixo","Prática de banda"].map(x => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Professor *"><select value={form.teacher || ""} onChange={e => update("teacher", e.target.value)}><option value="">Selecione</option>{["Ana Ribeiro","Rafael Costa","Marina Lopes","Diego Santos"].map(x => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Data"><select value={form.day ?? 3} onChange={e => update("day", Number(e.target.value))}>{weekdays.map((d, i) => <option value={i} key={d.short}>{d.short} · {d.day} out</option>)}</select></Field>
            <Field label="Sala"><select value={form.room || "Sala 01"} onChange={e => update("room", e.target.value)}>{["Sala 01","Sala 02","Sala 03","Sala 04","Estúdio"].map(x => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Início *"><input type="time" value={form.start || ""} onChange={e => update("start", e.target.value)} /></Field>
            <Field label="Fim"><input type="time" value={form.end || ""} onChange={e => update("end", e.target.value)} /></Field>
          </>}
          {type === "new-group" && <>
            <Field label="Nome da turma *" full><input autoFocus value={form.name || ""} onChange={e => update("name", e.target.value)} placeholder="Ex.: Orquestra Iniciante" /></Field>
            <Field label="Curso *"><input value={form.course || ""} onChange={e => update("course", e.target.value)} placeholder="Ex.: Violino" /></Field>
            <Field label="Professor *"><select value={form.teacher || ""} onChange={e => update("teacher", e.target.value)}><option value="">Selecione</option>{["Ana Ribeiro","Rafael Costa","Marina Lopes","Diego Santos"].map(x => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Horário"><input value={form.schedule || ""} onChange={e => update("schedule", e.target.value)} placeholder="Sábados · 10:00" /></Field>
            <Field label="Sala"><select value={form.room || "Sala 01"} onChange={e => update("room", e.target.value)}>{["Sala 01","Sala 02","Sala 03","Sala 04","Estúdio"].map(x => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Capacidade"><input type="number" min="1" value={form.capacity || 12} onChange={e => update("capacity", Number(e.target.value))} /></Field>
            <Field label="Nível"><select value={form.level || "Iniciante"} onChange={e => update("level", e.target.value)}><option>Iniciante</option><option>Intermediário</option><option>Avançado</option></select></Field>
          </>}
          {type === "new-payment" && <>
            <Field label="Aluno *" full><select autoFocus value={form.student || ""} onChange={e => update("student", e.target.value)}><option value="">Selecione o aluno</option>{students.map(s => <option key={s.id}>{s.name}</option>)}</select></Field>
            <Field label="Descrição *" full><input value={form.description || ""} onChange={e => update("description", e.target.value)} placeholder="Mensalidade · Curso" /></Field>
            <Field label="Valor *"><input type="number" min="0.01" step="0.01" value={form.amount || ""} onChange={e => update("amount", e.target.value)} placeholder="0,00" /></Field>
            <Field label="Vencimento"><input value={form.due || "05 nov 2026"} onChange={e => update("due", e.target.value)} /></Field>
            <Field label="Forma de pagamento"><select value={form.method || "Pix"} onChange={e => update("method", e.target.value)}><option>Pix</option><option>Cartão</option><option>Boleto</option><option>Dinheiro</option></select></Field>
            <Field label="Status"><select value={form.status || "Pendente"} onChange={e => update("status", e.target.value)}><option>Pendente</option><option>Pago</option><option>Atrasado</option></select></Field>
          </>}
          {type === "new-evaluation" && <>
            <Field label="Aluno *" full><select autoFocus value={form.studentId || ""} onChange={e => update("studentId", Number(e.target.value))}><option value="">Selecione o aluno</option>{students.map(s => <option value={s.id} key={s.id}>{s.name}</option>)}</select></Field>
            <Field label="Título *" full><input value={form.title || ""} onChange={e => update("title", e.target.value)} placeholder="Ex.: Evolução técnica" /></Field>
            <Field label="Nota (0–10)"><input type="number" min="0" max="10" step="0.5" value={form.score ?? 8} onChange={e => update("score", Number(e.target.value))} /></Field>
            <Field label="Data"><input value={form.date || "29 out 2026"} onChange={e => update("date", e.target.value)} /></Field>
            <Field label="Observações *" full><textarea rows="4" value={form.note || ""} onChange={e => update("note", e.target.value)} placeholder="Descreva avanços, dificuldades e próximos passos." /></Field>
          </>}
        </div>
        {error && <div className="form-error" role="alert"><AlertTriangle size={16} />{error}</div>}
        <footer className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancelar</button><button className="button button-primary" type="submit"><Check size={17} />Salvar registro</button></footer>
      </form>
    </Modal>
  );
}

function RevenueChart({ compact = false }) {
  const width = 720, height = compact ? 180 : 250, pad = 22;
  const points = revenueSeries.map((v, i) => `${pad + i * ((width - pad * 2) / (revenueSeries.length - 1))},${height - pad - (v / 110) * (height - pad * 2)}`).join(" ");
  const area = `${pad},${height - pad} ${points} ${width - pad},${height - pad}`;
  return (
    <div className="revenue-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Receita crescente nos últimos doze meses" preserveAspectRatio="none">
        <defs><linearGradient id={`area-${compact}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8ff47" stopOpacity=".25" /><stop offset="1" stopColor="#e8ff47" stopOpacity="0" /></linearGradient></defs>
        {[.25,.5,.75].map(v => <line key={v} x1={pad} x2={width-pad} y1={height*v} y2={height*v} className="chart-grid" />)}
        <polygon points={area} fill={`url(#area-${compact})`} />
        <polyline points={points} className="chart-line-shadow" /><polyline points={points} className="chart-line" />
        {revenueSeries.map((v,i) => { const [x,y] = points.split(" ")[i].split(","); return <circle key={i} cx={x} cy={y} r={i === revenueSeries.length - 1 ? 5 : 2.5} className={i === revenueSeries.length - 1 ? "chart-dot active" : "chart-dot"} />; })}
      </svg>
      <div className="chart-months">{["NOV","DEZ","JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT"].map(x => <span key={x}>{x}</span>)}</div>
    </div>
  );
}

function Dashboard({ students, classes, transactions, setView, openModal, openStudent }) {
  const todayClasses = classes.filter(c => c.day === 3).sort((a,b) => a.start.localeCompare(b.start));
  const active = students.filter(s => s.status === "Ativo").length;
  const received = transactions.filter(t => t.status === "Pago").reduce((a,b) => a + Number(b.amount), 0);
  const overdue = transactions.filter(t => t.status === "Atrasado").reduce((a,b) => a + Number(b.amount), 0);
  return (
    <div className="view dashboard-view">
      <PageTitle eyebrow="SISTEMA OPERACIONAL / ONLINE" title={<>Bom dia, Gabriel.<br/><span>A escola está em movimento.</span></>} description="Acompanhe o ritmo da escola e antecipe o que precisa da sua atenção." actions={<button className="button button-primary" onClick={() => openModal("new-student")}><UserPlus size={17}/>Novo aluno</button>} />
      <section className="stats-grid">
        <StatCard label="Alunos ativos" value={active + 121} delta="8,4%" icon={Users} detail={<><b>+12</b> novas matrículas neste mês</>} />
        <StatCard label="Receita em outubro" value={money.format(received + 24460)} delta="12,6%" icon={CircleDollarSign} tone="green" detail={<>Meta mensal: <b>R$ 36.000</b></>} />
        <StatCard label="Aulas nesta semana" value="48" delta="4,2%" icon={CalendarDays} tone="cyan" detail={<><b>92%</b> de ocupação das salas</>} />
        <StatCard label="Em inadimplência" value={money.format(overdue)} delta="2,1%" icon={AlertTriangle} tone="red" detail={<><b>2 cobranças</b> precisam de atenção</>} down />
      </section>
      <div className="dashboard-grid">
        <section className="panel revenue-panel">
          <header className="panel-header"><div><span className="panel-kicker">PERFORMANCE / 12 MESES</span><h2>Receita & crescimento</h2></div><Badge tone="green" dot>+18,2% no período</Badge></header>
          <div className="revenue-summary"><div><small>RECEITA ACUMULADA</small><strong>R$ 328.450</strong></div><div><small>TICKET MÉDIO</small><strong>R$ 412,80</strong></div></div>
          <RevenueChart />
        </section>
        <aside className="panel ai-panel">
          <div className="ai-orb"><BrainCircuit size={26}/><i/><i/></div><span className="panel-kicker">N.O.T.E. / INSIGHTS</span><h2>Inteligência aplicada à sua escola.</h2>
          <div className="ai-insight"><span>01</span><p><strong>Ocupação em alta</strong>As quintas à noite chegaram a 96%. Considere abrir uma nova turma de banda.</p></div>
          <div className="ai-insight"><span>02</span><p><strong>Risco de evasão</strong>2 alunos têm frequência abaixo de 75% nas últimas quatro semanas.</p></div>
          <button className="text-button" onClick={() => setView("reports")}>Explorar análise completa<ArrowRight size={15}/></button>
        </aside>
        <section className="panel schedule-preview">
          <header className="panel-header"><div><span className="panel-kicker">QUINTA / 29 OUT</span><h2>Aulas de hoje</h2></div><button className="button button-ghost button-small" onClick={() => setView("schedule")}>Ver agenda<ChevronRight size={15}/></button></header>
          <div className="today-list">
            {todayClasses.slice(0,4).map(item => <button className="today-item" key={item.id} onClick={() => setView("schedule")}><time>{item.start}</time><span className="timeline-node"/><div><strong>{item.student}</strong><small>{item.course} · {item.teacher}</small></div><Badge tone={item.status === "Pendente" ? "yellow" : "neutral"}>{item.room}</Badge></button>)}
          </div>
        </section>
        <section className="panel students-preview">
          <header className="panel-header"><div><span className="panel-kicker">ACOMPANHAMENTO</span><h2>Alunos em destaque</h2></div><button className="icon-button" onClick={() => setView("students")} aria-label="Ver todos os alunos"><ArrowUpRight size={18}/></button></header>
          <div className="student-highlight-list">{students.slice(0,4).map(s => <button key={s.id} onClick={() => openStudent(s)} className="student-highlight"><Avatar student={s}/><div><strong>{s.name}</strong><small>{s.course} · {s.level}</small></div><div className="highlight-progress"><span>{s.progress}%</span><ProgressBar value={s.progress}/></div></button>)}</div>
        </section>
      </div>
    </div>
  );
}

function StudentsView({ students, openModal, openStudent }) {
  const [query, setQuery] = useState(""); const [status, setStatus] = useState("Todos"); const [course, setCourse] = useState("Todos");
  const filtered = students.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) && (status === "Todos" || s.status === status) && (course === "Todos" || s.course === course));
  const exportCsv = () => downloadFile("alunos-notesystem.csv", "Nome;Curso;Professor;Status;Frequência\n" + students.map(s => `${s.name};${s.course};${s.teacher};${s.status};${s.attendance}%`).join("\n"), "text/csv");
  return <div className="view">
    <PageTitle eyebrow="GESTÃO / MATRÍCULAS" title="Alunos" description={`${students.length} matrículas no ambiente local · ${students.filter(s=>s.status === "Ativo").length} ativas agora`} actions={<><button className="button button-secondary" onClick={exportCsv}><Download size={16}/>Exportar</button><button className="button button-primary" onClick={() => openModal("new-student")}><Plus size={17}/>Novo aluno</button></>} />
    <section className="panel table-panel">
      <div className="table-toolbar"><label className="inline-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por nome do aluno..." aria-label="Buscar alunos"/>{query && <button onClick={()=>setQuery("")} aria-label="Limpar busca"><X size={15}/></button>}</label><div className="filter-group"><Filter size={16}/><select value={course} onChange={e=>setCourse(e.target.value)} aria-label="Filtrar por curso"><option>Todos</option>{[...new Set(students.map(s=>s.course))].map(x=><option key={x}>{x}</option>)}</select><select value={status} onChange={e=>setStatus(e.target.value)} aria-label="Filtrar por status">{["Todos","Ativo","Pendente","Inativo"].map(x=><option key={x}>{x}</option>)}</select></div></div>
      {filtered.length ? <div className="responsive-table"><table><thead><tr><th>ALUNO</th><th>CURSO / NÍVEL</th><th>PROFESSOR</th><th>FREQUÊNCIA</th><th>STATUS</th><th>PRÓXIMA AULA</th><th aria-label="Ações" /></tr></thead><tbody>{filtered.map(s=><tr key={s.id}><td><button className="person-cell" onClick={()=>openStudent(s)}><Avatar student={s}/><span><strong>{s.name}</strong><small>{s.email}</small></span></button></td><td><strong className="table-primary">{s.course}</strong><small>{s.level}</small></td><td>{s.teacher}</td><td><div className="attendance-cell"><span>{s.attendance}%</span><ProgressBar value={s.attendance} tone={s.attendance < 75 ? "red" : "green"}/></div></td><td><Badge tone={s.status === "Ativo" ? "green" : s.status === "Pendente" ? "yellow" : "neutral"} dot>{s.status}</Badge></td><td><span className="next-class"><Clock3 size={14}/>{s.nextClass}</span></td><td><button className="icon-button" onClick={()=>openStudent(s)} aria-label={`Detalhes de ${s.name}`}><ChevronRight size={17}/></button></td></tr>)}</tbody></table></div> : <EmptyState title="Nenhum aluno encontrado" text="Ajuste os filtros ou cadastre uma nova matrícula." action={<button className="button button-secondary" onClick={()=>{setQuery("");setCourse("Todos");setStatus("Todos");}}>Limpar filtros</button>}/>} 
      <footer className="table-footer"><span>Exibindo <strong>{filtered.length}</strong> de {students.length} alunos</span><span>Dados sincronizados neste navegador</span></footer>
    </section>
  </div>;
}

function ScheduleView({ classes, openModal }) {
  const [selectedDay, setSelectedDay] = useState(3); const [weekOffset, setWeekOffset] = useState(0); const [teacher, setTeacher] = useState("Todos");
  const visible = weekOffset === 0 ? classes.filter(c=>c.day === selectedDay && (teacher === "Todos" || c.teacher === teacher)).sort((a,b)=>a.start.localeCompare(b.start)) : [];
  return <div className="view">
    <PageTitle eyebrow="OPERAÇÃO / AGENDA" title="Agenda de aulas" description="Organize horários, professores e salas sem perder o ritmo." actions={<button className="button button-primary" onClick={()=>openModal("new-class")}><CalendarPlus size={17}/>Agendar aula</button>} />
    <section className="panel calendar-panel">
      <div className="calendar-toolbar"><div className="week-nav"><button className="icon-button" onClick={()=>setWeekOffset(v=>v-1)} aria-label="Semana anterior"><ChevronLeft size={18}/></button><button className="button button-ghost button-small" onClick={()=>setWeekOffset(0)}>Hoje</button><button className="icon-button" onClick={()=>setWeekOffset(v=>v+1)} aria-label="Próxima semana"><ChevronRight size={18}/></button><strong>{weekOffset === 0 ? "26 OUT — 31 OUT 2026" : weekOffset < 0 ? `${Math.abs(weekOffset)} SEMANA${Math.abs(weekOffset)>1?"S":""} ANTERIOR${Math.abs(weekOffset)>1?"ES":""}` : `${weekOffset} SEMANA${weekOffset>1?"S":""} À FRENTE`}</strong></div><select value={teacher} onChange={e=>setTeacher(e.target.value)} aria-label="Filtrar professor"><option>Todos</option>{["Ana Ribeiro","Rafael Costa","Marina Lopes","Diego Santos"].map(x=><option key={x}>{x}</option>)}</select></div>
      <div className="week-strip">{weekdays.map((d,i)=><button key={d.short} className={selectedDay === i ? "selected" : ""} onClick={()=>setSelectedDay(i)}><span>{d.short}</span><strong>{weekOffset === 0 ? d.day : "—"}</strong>{weekOffset === 0 && <i className={classes.some(c=>c.day===i)?"has-events":""}/>}</button>)}</div>
      <div className="schedule-content"><div className="day-heading"><div><span className="panel-kicker">{weekdays[selectedDay].short} / {weekOffset === 0 ? `${weekdays[selectedDay].day} OUT` : "FORA DO PERÍODO"}</span><h2>{visible.length} {visible.length===1?"aula programada":"aulas programadas"}</h2></div><div className="schedule-legend"><span><i className="legend-individual"/>Individual</span><span><i className="legend-group"/>Coletiva</span></div></div>
      {visible.length ? <div className="agenda-list">{visible.map(item=><article className={`agenda-item ${item.type === "Coletiva"?"agenda-group":""}`} key={item.id}><div className="agenda-time"><strong>{item.start}</strong><span>{item.end || "—"}</span></div><span className="agenda-line"><i/></span><div className="agenda-main"><div><Badge tone={item.type === "Coletiva"?"cyan":"yellow"}>{item.type}</Badge><h3>{item.student}</h3><p>{item.course} · {item.teacher}</p></div><div className="agenda-meta"><span><MapPin size={15}/>{item.room}</span><Badge tone={item.status === "Confirmada"?"green":"yellow"} dot>{item.status}</Badge></div></div></article>)}</div> : <EmptyState icon={CalendarDays} title="Nenhuma aula neste dia" text={weekOffset !== 0 ? "O calendário demonstrativo está preenchido apenas na semana atual." : "Não há aulas para os filtros selecionados. Aproveite para agendar uma nova aula."} action={<button className="button button-secondary" onClick={()=>openModal("new-class")}><Plus size={16}/>Agendar aula</button>}/>} 
      </div>
    </section>
  </div>;
}

function GroupsView({ groups, openModal }) {
  const icons = [Guitar, Music2, Piano, Mic2];
  return <div className="view"><PageTitle eyebrow="ACADÊMICO / ESTRUTURA" title="Turmas & cursos" description="Acompanhe ocupação, níveis e horários de cada formação." actions={<button className="button button-primary" onClick={()=>openModal("new-group")}><Plus size={17}/>Nova turma</button>}/>
    <div className="group-grid">{groups.map((g,i)=>{ const Icon = icons[i%icons.length]; const occupancy = Math.round(g.students/g.capacity*100); return <article className="panel group-card" key={g.id}><header><span className="group-icon"><Icon size={23}/></span><Badge tone={occupancy>=100?"red":occupancy>=85?"yellow":"green"} dot>{occupancy>=100?"Lotada":`${g.capacity-g.students} vagas`}</Badge></header><span className="panel-kicker">{g.course.toUpperCase()}</span><h2>{g.name}</h2><p>{g.level} · {g.teacher}</p><div className="group-occupancy"><div><span>Ocupação</span><strong>{g.students}/{g.capacity} alunos</strong></div><ProgressBar value={occupancy} tone={occupancy>=100?"red":"yellow"}/></div><footer><span><CalendarDays size={15}/>{g.schedule}</span><span><MapPin size={15}/>{g.room}</span></footer></article>;})}</div>
    <section className="panel course-distribution"><div><span className="panel-kicker">DISTRIBUIÇÃO / CURSOS</span><h2>Uma escola, múltiplas sonoridades.</h2><p>Os cursos individuais representam 72% das matrículas ativas. Turmas coletivas aumentaram 14% neste semestre.</p></div><div className="distribution-visual"><div className="donut"><span><strong>184</strong><small>MATRÍCULAS</small></span></div><div className="distribution-legend"><span><i className="dot-yellow"/>Instrumentos individuais <b>72%</b></span><span><i className="dot-cyan"/>Turmas coletivas <b>18%</b></span><span><i className="dot-violet"/>Canto & musicalização <b>10%</b></span></div></div></section>
  </div>;
}

function FinanceView({ transactions, openModal, markPaid }) {
  const [filter,setFilter] = useState("Todos");
  const filtered = filter === "Todos" ? transactions : transactions.filter(t=>t.status===filter);
  const paid = transactions.filter(t=>t.status==="Pago").reduce((a,b)=>a+Number(b.amount),0)+24460;
  const pending = transactions.filter(t=>t.status==="Pendente").reduce((a,b)=>a+Number(b.amount),0);
  const late = transactions.filter(t=>t.status==="Atrasado").reduce((a,b)=>a+Number(b.amount),0);
  return <div className="view"><PageTitle eyebrow="FINANCEIRO / OUTUBRO" title="Fluxo financeiro" description="Receita previsível, cobranças organizadas e decisões mais claras." actions={<button className="button button-primary" onClick={()=>openModal("new-payment")}><Plus size={17}/>Nova cobrança</button>}/>
    <section className="finance-stats"><article className="finance-balance border-glow-green"><span><CheckCircle2 size={17}/>RECEBIDO NO MÊS</span><strong>{money.format(paid)}</strong><small><ArrowUpRight size={14}/>12,6% acima de setembro</small></article><article><span><Clock3 size={17}/>A RECEBER</span><strong>{money.format(pending)}</strong><small>{transactions.filter(t=>t.status==="Pendente").length} cobranças pendentes</small></article><article className="border-glow-red"><span><AlertTriangle size={17}/>EM ATRASO</span><strong>{money.format(late)}</strong><small>{transactions.filter(t=>t.status==="Atrasado").length} cobranças vencidas</small></article></section>
    <div className="finance-layout"><section className="panel"><header className="panel-header"><div><span className="panel-kicker">RECEITA / 12 MESES</span><h2>Desempenho financeiro</h2></div><Badge tone="green">META 82%</Badge></header><RevenueChart compact/></section><section className="panel collection-panel"><span className="panel-kicker">EFICIÊNCIA DE RECEBIMENTO</span><div className="collection-score"><strong>91<span>%</span></strong><Target size={34}/></div><ProgressBar value={91} tone="green"/><p>Recebimentos dentro do prazo. O índice ideal para a escola é acima de 90%.</p><div className="collection-split"><span>Pix <b>64%</b></span><span>Cartão <b>24%</b></span><span>Boleto <b>12%</b></span></div></section></div>
    <section className="panel table-panel"><div className="table-toolbar"><div><span className="panel-kicker">TRANSAÇÕES RECENTES</span><h2>Mensalidades</h2></div><div className="segmented-control">{["Todos","Pago","Pendente","Atrasado"].map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x}</button>)}</div></div>{filtered.length?<div className="responsive-table"><table><thead><tr><th>ALUNO / DESCRIÇÃO</th><th>VENCIMENTO</th><th>VALOR</th><th>MÉTODO</th><th>STATUS</th><th>AÇÃO</th></tr></thead><tbody>{filtered.map(t=><tr key={t.id}><td><strong className="table-primary">{t.student}</strong><small>{t.description}</small></td><td>{t.due}</td><td><strong>{money.format(Number(t.amount))}</strong></td><td>{t.method}</td><td><Badge tone={t.status==="Pago"?"green":t.status==="Atrasado"?"red":"yellow"} dot>{t.status}</Badge></td><td>{t.status!=="Pago"?<button className="button button-ghost button-small" onClick={()=>markPaid(t.id)}><Check size={14}/>Baixar</button>:<span className="paid-check"><CheckCircle2 size={17}/></span>}</td></tr>)}</tbody></table></div>:<EmptyState icon={CreditCard} title="Nenhuma cobrança" text="Não há transações com este status."/>}</section>
  </div>;
}

function PedagogyView({ students, evaluations, openModal }) {
  const [selectedId,setSelectedId] = useState(students[0]?.id); const selected = students.find(s=>s.id===selectedId)||students[0];
  const studentEvals = evaluations.filter(e=>e.studentId===selected?.id);
  return <div className="view"><PageTitle eyebrow="PEDAGÓGICO / EVOLUÇÃO" title="Acompanhamento que faz sentido" description="Repertório, frequência e avaliações em uma única partitura." actions={<button className="button button-primary" onClick={()=>openModal("new-evaluation")}><Plus size={17}/>Nova avaliação</button>}/>
    <div className="pedagogy-layout"><section className="panel pedagogy-roster"><header><span className="panel-kicker">ALUNOS / PROGRESSO</span><h2>Turma individual</h2></header><div>{students.filter(s=>s.status!=="Inativo").map(s=><button key={s.id} className={selected?.id===s.id?"active":""} onClick={()=>setSelectedId(s.id)}><Avatar student={s}/><span><strong>{s.name}</strong><small>{s.course} · {s.level}</small><ProgressBar value={s.progress}/></span><b>{s.progress}%</b></button>)}</div></section>
      {selected&&<section className="panel student-development"><header className="development-header"><div className="development-person"><Avatar student={selected} size="lg"/><div><span className="panel-kicker">PERFIL DE APRENDIZAGEM</span><h2>{selected.name}</h2><p>{selected.course} · {selected.teacher}</p></div></div><Badge tone="green" dot>Evolução constante</Badge></header><div className="skill-grid"><div><span>Técnica instrumental</span><strong>{Math.min(98,selected.progress+8)}%</strong><ProgressBar value={Math.min(98,selected.progress+8)}/></div><div><span>Leitura musical</span><strong>{Math.max(30,selected.progress-4)}%</strong><ProgressBar value={Math.max(30,selected.progress-4)} tone="cyan"/></div><div><span>Percepção rítmica</span><strong>{Math.min(96,selected.progress+3)}%</strong><ProgressBar value={Math.min(96,selected.progress+3)} tone="green"/></div><div><span>Repertório</span><strong>{selected.progress}%</strong><ProgressBar value={selected.progress} tone="violet"/></div></div><div className="repertoire-block"><span className="panel-kicker">REPERTÓRIO ATUAL</span><div className="repertoire-item"><Music2 size={20}/><div><strong>{selected.course==="Piano"?"Clair de Lune — C. Debussy":selected.course==="Canto"?"Someone Like You — Adele":"Repertório autoral · Estudo III"}</strong><small>Em aperfeiçoamento · próxima apresentação 18 nov</small></div><Badge tone="yellow">EM ESTUDO</Badge></div></div><div className="evaluation-block"><div className="section-inline-title"><span className="panel-kicker">AVALIAÇÕES RECENTES</span><span>{studentEvals.length} registros</span></div>{studentEvals.length?studentEvals.map(e=><article className="evaluation-item" key={e.id}><div className="evaluation-score">{Number(e.score).toFixed(1)}</div><div><strong>{e.title}</strong><p>{e.note}</p><small>{e.date}</small></div></article>):<EmptyState icon={BookOpenCheck} title="Sem avaliações ainda" text="Registre a primeira avaliação deste aluno para acompanhar sua evolução."/>}</div></section>}
    </div>
  </div>;
}

function ReportsView({ students, transactions, showToast }) {
  const [period,setPeriod]=useState("Últimos 30 dias"); const [report,setReport]=useState("Visão executiva");
  const reports=[{name:"Visão executiva",icon:Activity,desc:"Indicadores essenciais da operação e crescimento."},{name:"Desempenho financeiro",icon:TrendingUp,desc:"Receita, ticket médio e inadimplência."},{name:"Frequência & retenção",icon:UserRoundCheck,desc:"Presença, evasão e engajamento dos alunos."},{name:"Ocupação da agenda",icon:CalendarDays,desc:"Uso de salas, horários e disponibilidade docente."}];
  const generate=()=>showToast(`${report} atualizado para ${period.toLowerCase()}.`,"success");
  const exportReport=()=>{downloadFile("relatorio-notesystem.csv",`Relatório;${report}\nPeríodo;${period}\nAlunos;${students.length}\nReceita registrada;${transactions.reduce((a,b)=>a+Number(b.amount),0)}\nFrequência média;${Math.round(students.reduce((a,b)=>a+b.attendance,0)/students.length)}%`,"text/csv");showToast("Relatório exportado em CSV.","success");};
  return <div className="view"><PageTitle eyebrow="INTELIGÊNCIA / RELATÓRIOS" title="Decisões com mais clareza" description="Transforme a rotina da escola em informação útil e acionável." actions={<button className="button button-secondary" onClick={exportReport}><Download size={16}/>Exportar CSV</button>}/>
    <div className="report-controls"><div className="report-types">{reports.map(r=><button key={r.name} className={report===r.name?"active":""} onClick={()=>setReport(r.name)}><r.icon size={19}/><span><strong>{r.name}</strong><small>{r.desc}</small></span><ChevronRight size={16}/></button>)}</div><div className="period-control"><label>PERÍODO DE ANÁLISE<select value={period} onChange={e=>setPeriod(e.target.value)}><option>Últimos 30 dias</option><option>Últimos 90 dias</option><option>Ano de 2026</option></select></label><button className="button button-primary" onClick={generate}><Zap size={16}/>Atualizar análise</button></div></div>
    <section className="panel executive-report"><header className="panel-header"><div><span className="panel-kicker">{period.toUpperCase()} / NOTE ANALYTICS</span><h2>{report}</h2></div><Badge tone="green" dot>Dados atualizados</Badge></header><div className="report-kpis"><div><small>ALUNOS ATIVOS</small><strong>{students.filter(s=>s.status==="Ativo").length+121}</strong><span className="positive">+8,4%</span></div><div><small>FREQUÊNCIA MÉDIA</small><strong>{Math.round(students.reduce((a,b)=>a+b.attendance,0)/students.length)}%</strong><span className="positive">+2,1%</span></div><div><small>RECEITA</small><strong>R$ 29,4k</strong><span className="positive">+12,6%</span></div><div><small>RETENÇÃO</small><strong>96,2%</strong><span className="positive">+1,8%</span></div></div><RevenueChart/><div className="report-conclusion"><Sparkles size={20}/><p><strong>Leitura do período</strong>A escola mantém crescimento consistente sem perder qualidade de frequência. A maior oportunidade está na ampliação das turmas coletivas no turno da noite.</p></div></section>
  </div>;
}

function SettingsView({ settings, setSettings, onSave, onExport, onReset }) {
  const [tab,setTab]=useState("Geral"); const [draft,setDraft]=useState(settings);
  return <div className="view"><PageTitle eyebrow="SISTEMA / PREFERÊNCIAS" title="Configurações" description="Ajuste o NoteSystem ao funcionamento da sua escola." actions={<button className="button button-primary" onClick={()=>{setSettings(draft);onSave();}}><Save size={16}/>Salvar alterações</button>}/>
    <div className="settings-layout"><nav className="settings-nav" aria-label="Seções de configurações">{["Geral","Notificações","Dados & privacidade"].map(x=><button key={x} className={tab===x?"active":""} onClick={()=>setTab(x)}>{x==="Geral"?<Settings size={17}/>:x==="Notificações"?<Bell size={17}/>:<ShieldCheck size={17}/>} {x}<ChevronRight size={15}/></button>)}</nav><section className="panel settings-panel">
      {tab==="Geral"&&<><header><span className="panel-kicker">IDENTIDADE DA ESCOLA</span><h2>Informações gerais</h2><p>Estes dados aparecem nos relatórios e comunicações.</p></header><div className="form-grid"><Field label="Nome da escola" full><input value={draft.schoolName} onChange={e=>setDraft({...draft,schoolName:e.target.value})}/></Field><Field label="E-mail administrativo"><input type="email" value={draft.email} onChange={e=>setDraft({...draft,email:e.target.value})}/></Field><Field label="Telefone"><input value={draft.phone} onChange={e=>setDraft({...draft,phone:e.target.value})}/></Field><Field label="Início da operação"><input type="time" value={draft.openTime} onChange={e=>setDraft({...draft,openTime:e.target.value})}/></Field><Field label="Encerramento"><input type="time" value={draft.closeTime} onChange={e=>setDraft({...draft,closeTime:e.target.value})}/></Field></div><div className="theme-setting"><div><strong>Aparência do sistema</strong><p>Interface otimizada para foco e baixa luminosidade.</p></div><Badge tone="yellow" dot>Dark / sempre ativo</Badge></div></>}
      {tab==="Notificações"&&<><header><span className="panel-kicker">CENTRAL DE AVISOS</span><h2>Notificações</h2><p>Escolha quais eventos merecem interromper seu fluxo.</p></header><div className="toggle-list">{[["payments","Cobranças e vencimentos","Receba alertas de mensalidades pendentes e em atraso."],["classes","Alterações na agenda","Saiba quando uma aula for criada ou reagendada."],["insights","Insights semanais","Receba um resumo de desempenho toda segunda-feira."]].map(([key,title,text])=><label key={key}><div><strong>{title}</strong><p>{text}</p></div><input type="checkbox" checked={draft[key]} onChange={e=>setDraft({...draft,[key]:e.target.checked})}/><span className="toggle-ui"/></label>)}</div></>}
      {tab==="Dados & privacidade"&&<><header><span className="panel-kicker">CONTROLE / LGPD</span><h2>Dados & privacidade</h2><p>Exporte uma cópia dos registros locais ou restaure o ambiente de demonstração.</p></header><div className="data-actions"><article><Database size={23}/><div><strong>Backup dos dados</strong><p>Baixe alunos, aulas, cobranças e avaliações em formato JSON.</p></div><button className="button button-secondary" onClick={onExport}><Download size={16}/>Exportar backup</button></article><article className="danger-zone"><RotateCcw size={23}/><div><strong>Restaurar demonstração</strong><p>Substitui os dados locais pelos registros originais do sistema.</p></div><button className="button button-danger" onClick={onReset}><RotateCcw size={16}/>Restaurar dados</button></article></div><div className="privacy-note"><ShieldCheck size={20}/><p>Nesta versão, os dados permanecem somente neste navegador. Nenhuma informação é enviada a servidores externos.</p></div></>}
    </section></div>
  </div>;
}

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download=name; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

export function App() {
  const [view,setView]=useState("dashboard"); const [mobileNav,setMobileNav]=useState(false);
  const [students,setStudents]=usePersistentState("notesystem-students",initialStudents);
  const [classes,setClasses]=usePersistentState("notesystem-classes",initialClasses);
  const [groups,setGroups]=usePersistentState("notesystem-groups",initialGroups);
  const [transactions,setTransactions]=usePersistentState("notesystem-transactions",initialTransactions);
  const [evaluations,setEvaluations]=usePersistentState("notesystem-evaluations",initialEvaluations);
  const [notifications,setNotifications]=usePersistentState("notesystem-notifications",initialNotifications);
  const [settings,setSettings]=usePersistentState("notesystem-settings",{schoolName:"Oficina V12 · Escola de Música",email:"contato@oficinav12.com.br",phone:"(11) 3456-1280",openTime:"08:00",closeTime:"22:00",payments:true,classes:true,insights:true});
  const [modal,setModal]=useState(null); const [selectedStudent,setSelectedStudent]=useState(null);
  const [search,setSearch]=useState(""); const [searchOpen,setSearchOpen]=useState(false); const [notificationsOpen,setNotificationsOpen]=useState(false); const [profileOpen,setProfileOpen]=useState(false);
  const [assistantOpen,setAssistantOpen]=useState(false); const [assistantInput,setAssistantInput]=useState(""); const [messages,setMessages]=useState([{from:"bot",text:"Olá, Gabriel. Sou o N.O.T.E., seu assistente operacional. Posso resumir alunos, agenda e finanças deste ambiente."}]);
  const [toast,setToast]=useState(null); const searchRef=useRef(null);
  const showToast=(text,tone="success")=>setToast({text,tone});
  useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(null),3200);return()=>clearTimeout(t);}},[toast]);
  useEffect(()=>{const handler=e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();searchRef.current?.focus();setSearchOpen(true);}if(e.key==="Escape"){setSearchOpen(false);setNotificationsOpen(false);setProfileOpen(false);setSelectedStudent(null);setAssistantOpen(false);setMobileNav(false);}};window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler);},[]);
  const navigate=id=>{setView(id);setMobileNav(false);setSearchOpen(false);setSearch("");window.scrollTo({top:0,behavior:"smooth"});};
  const openModal=(type,data=null)=>setModal({type,data});
  const openStudent=s=>{setSelectedStudent(s);setSearchOpen(false);setSearch("");};
  const handleSubmit=(type,form)=>{
    if(type==="new-student"){const item={...form,id:Date.now(),initials:form.name.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase(),attendance:100,progress:0,nextClass:"Sem aula agendada",color:"yellow",level:form.level||"Iniciante",status:form.status||"Ativo"};setStudents(v=>[item,...v]);showToast(`${form.name} foi matriculado com sucesso.`);}
    if(type==="edit-student"){setStudents(v=>v.map(s=>s.id===form.id?{...s,...form}:s));setSelectedStudent(form);showToast("Dados do aluno atualizados.");}
    if(type==="new-class"){setClasses(v=>[...v,{...form,id:Date.now(),type:form.type||"Individual",status:"Pendente"}]);showToast(`Aula de ${form.student} agendada para ${form.start}.`);}
    if(type==="new-group"){setGroups(v=>[...v,{...form,id:Date.now(),students:0,capacity:form.capacity||12}]);showToast(`Turma ${form.name} criada.`);}
    if(type==="new-payment"){setTransactions(v=>[{...form,id:Date.now(),amount:Number(form.amount)},...v]);showToast("Cobrança registrada no financeiro.");}
    if(type==="new-evaluation"){setEvaluations(v=>[{...form,id:Date.now()},...v]);showToast("Avaliação pedagógica registrada.");}
    setModal(null);
  };
  const markPaid=id=>{setTransactions(v=>v.map(t=>t.id===id?{...t,status:"Pago"}:t));showToast("Pagamento baixado com sucesso.");};
  const resetData=()=>{setStudents(initialStudents);setClasses(initialClasses);setGroups(initialGroups);setTransactions(initialTransactions);setEvaluations(initialEvaluations);setNotifications(initialNotifications);setModal(null);showToast("Ambiente de demonstração restaurado.");};
  const exportBackup=()=>{downloadFile("notesystem-backup.json",JSON.stringify({students,classes,groups,transactions,evaluations,settings,exportedAt:new Date().toISOString()},null,2),"application/json");showToast("Backup JSON exportado.");};
  const searchResults=useMemo(()=>{const q=search.trim().toLowerCase();if(!q)return[];const people=students.filter(s=>`${s.name} ${s.course}`.toLowerCase().includes(q)).slice(0,4).map(s=>({type:"student",id:s.id,title:s.name,sub:`${s.course} · ${s.status}`,data:s}));const pages=NAV_ITEMS.filter(n=>n.label.toLowerCase().includes(q)).map(n=>({type:"page",id:n.id,title:n.label,sub:"Ir para módulo",icon:n.icon}));return[...people,...pages];},[search,students]);
  const sendAssistant=text=>{const value=(text||assistantInput).trim();if(!value)return;setMessages(v=>[...v,{from:"user",text:value}]);setAssistantInput("");const q=value.toLowerCase();let answer="Posso ajudar com resumos de alunos, agenda, finanças e frequência. Experimente uma das sugestões abaixo.";if(q.includes("atras")||q.includes("financeiro")||q.includes("receita")){const late=transactions.filter(t=>t.status==="Atrasado");answer=`Há ${late.length} cobranças em atraso, totalizando ${money.format(late.reduce((a,b)=>a+Number(b.amount),0))}. A receita registrada como paga neste ambiente é ${money.format(transactions.filter(t=>t.status==="Pago").reduce((a,b)=>a+Number(b.amount),0))}.`;}else if(q.includes("aula")||q.includes("agenda")||q.includes("hoje")){answer=`Existem ${classes.filter(c=>c.day===3).length} aulas programadas para hoje. A próxima é ${classes.filter(c=>c.day===3).sort((a,b)=>a.start.localeCompare(b.start))[0]?.student||"não identificada"}.`; }else if(q.includes("frequ")||q.includes("risco")||q.includes("aluno")){const risk=students.filter(s=>s.attendance<80);answer=`${risk.length} aluno(s) estão com frequência abaixo de 80%: ${risk.map(s=>s.name).join(", ")||"nenhum"}. Recomendo revisar o acompanhamento pedagógico.`;}setTimeout(()=>setMessages(v=>[...v,{from:"bot",text:answer}]),280);};
  const unread=notifications.filter(n=>!n.read).length;
  const common={openModal};
  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
    {mobileNav&&<button className="nav-scrim" aria-label="Fechar menu" onClick={()=>setMobileNav(false)}/>}
    <aside className={`sidebar ${mobileNav?"mobile-open":""}`}>
      <div className="sidebar-brand"><Logo/><button className="icon-button mobile-close" onClick={()=>setMobileNav(false)} aria-label="Fechar menu"><X size={19}/></button></div>
      <button className="workspace-switch" onClick={()=>navigate("settings")}><span className="workspace-emblem">V12</span><span><strong>Oficina V12</strong><small>ESCOLA DE MÚSICA</small></span><ChevronDown size={15}/></button>
      <nav className="main-nav" aria-label="Navegação principal">{NAV_ITEMS.map((item,i)=><div key={item.id}>{item.section&&<span className="nav-section">{item.section}</span>}<button className={view===item.id?"active":""} onClick={()=>navigate(item.id)}><item.icon size={18}/><span>{item.label}</span>{item.id==="finance"&&transactions.some(t=>t.status==="Atrasado")&&<i className="nav-alert"/>}{view===item.id&&<ChevronRight size={14} className="nav-active-arrow"/>}</button></div>)}</nav>
      <div className="sidebar-bottom"><button className={`assistant-trigger ${assistantOpen?"active":""}`} onClick={()=>setAssistantOpen(true)}><span className="assistant-symbol"><BrainCircuit size={20}/><i/></span><span><strong>Assistente N.O.T.E.</strong><small>INTELIGÊNCIA OPERACIONAL</small></span><Sparkles size={16}/></button><button className={`settings-link ${view==="settings"?"active":""}`} onClick={()=>navigate("settings")}><Settings size={18}/>Configurações</button><div className="system-status"><span><i/>SISTEMA OPERACIONAL</span><small>v1.0.0 · LOCAL</small></div></div>
    </aside>
    <div className="main-column">
      <header className="topbar"><button className="icon-button menu-trigger" onClick={()=>setMobileNav(true)} aria-label="Abrir menu"><Menu size={20}/></button><div className="breadcrumb"><span>NoteSystem</span><ChevronRight size={13}/><strong>{VIEW_META[view][0]}</strong></div>
        <div className="topbar-actions"><div className="global-search"><Search size={17}/><input ref={searchRef} value={search} onFocus={()=>setSearchOpen(true)} onChange={e=>{setSearch(e.target.value);setSearchOpen(true);}} placeholder="Buscar em todo o sistema..." aria-label="Busca global"/><kbd><Command size={12}/>K</kbd>{searchOpen&&search&&<div className="search-results">{searchResults.length?searchResults.map(r=><button key={`${r.type}-${r.id}`} onClick={()=>r.type==="student"?openStudent(r.data):navigate(r.id)}>{r.type==="student"?<Users size={17}/>:<r.icon size={17}/>}<span><strong>{r.title}</strong><small>{r.sub}</small></span><ArrowUpRight size={15}/></button>):<EmptyState title="Sem resultados" text="Tente buscar por outro nome ou módulo."/>}</div>}</div>
          <div className="popover-anchor"><button className="icon-button notification-button" onClick={()=>{setNotificationsOpen(v=>!v);setProfileOpen(false);}} aria-label={`Notificações, ${unread} não lidas`}><Bell size={19}/>{unread>0&&<i>{unread}</i>}</button>{notificationsOpen&&<div className="popover notifications-popover"><header><div><span className="panel-kicker">CENTRAL DE AVISOS</span><h3>Notificações</h3></div>{unread>0&&<button onClick={()=>setNotifications(v=>v.map(n=>({...n,read:true})))}>Marcar como lidas</button>}</header><div>{notifications.map(n=><button key={n.id} className={!n.read?"unread":""} onClick={()=>{setNotifications(v=>v.map(x=>x.id===n.id?{...x,read:true}:x));if(n.type==="warning")navigate("finance");else if(n.type==="info")navigate("schedule");setNotificationsOpen(false);}}><span className={`notification-icon notification-${n.type}`}>{n.type==="warning"?<AlertTriangle size={17}/>:n.type==="info"?<Info size={17}/>:<CheckCircle2 size={17}/>}</span><span><strong>{n.title}</strong><p>{n.text}</p><small>{n.time} atrás</small></span></button>)}</div></div>}</div>
          <div className="popover-anchor"><button className="profile-button" onClick={()=>{setProfileOpen(v=>!v);setNotificationsOpen(false);}} aria-label="Abrir menu do perfil"><span>GM</span><div><strong>Gabriel Martins</strong><small>ADMINISTRADOR</small></div><ChevronDown size={14}/></button>{profileOpen&&<div className="popover profile-popover"><button onClick={()=>{navigate("settings");setProfileOpen(false);}}><Settings size={16}/>Preferências da conta</button><button onClick={()=>{exportBackup();setProfileOpen(false);}}><Download size={16}/>Exportar meus dados</button></div>}</div>
        </div>
      </header>
      <main id="main-content">
        {view==="dashboard"&&<Dashboard students={students} classes={classes} transactions={transactions} setView={navigate} openModal={openModal} openStudent={openStudent}/>} 
        {view==="students"&&<StudentsView students={students} {...common} openStudent={openStudent}/>} 
        {view==="schedule"&&<ScheduleView classes={classes} {...common}/>} 
        {view==="groups"&&<GroupsView groups={groups} {...common}/>} 
        {view==="finance"&&<FinanceView transactions={transactions} {...common} markPaid={markPaid}/>} 
        {view==="pedagogy"&&<PedagogyView students={students} evaluations={evaluations} {...common}/>} 
        {view==="reports"&&<ReportsView students={students} transactions={transactions} showToast={showToast}/>} 
        {view==="settings"&&<SettingsView settings={settings} setSettings={setSettings} onSave={()=>showToast("Preferências salvas neste navegador.")} onExport={exportBackup} onReset={()=>openModal("reset")}/>} 
      </main>
      <footer className="app-footer"><span>NOTE SYSTEM © 2026</span><span><i/>AMBIENTE LOCAL · DADOS NESTE NAVEGADOR</span></footer>
    </div>
    {selectedStudent&&<><button className="drawer-scrim" onClick={()=>setSelectedStudent(null)} aria-label="Fechar detalhes"/><aside className="student-drawer"><header><span className="eyebrow"><i/>PERFIL / MATRÍCULA #{String(selectedStudent.id).slice(-4)}</span><button className="icon-button" onClick={()=>setSelectedStudent(null)} aria-label="Fechar"><X size={19}/></button></header><div className="drawer-profile"><Avatar student={selectedStudent} size="xl"/><h2>{selectedStudent.name}</h2><p>{selectedStudent.course} · {selectedStudent.level}</p><Badge tone={selectedStudent.status==="Ativo"?"green":"yellow"} dot>{selectedStudent.status}</Badge></div><div className="drawer-stats"><div><small>FREQUÊNCIA</small><strong>{selectedStudent.attendance}%</strong></div><div><small>PROGRESSO</small><strong>{selectedStudent.progress}%</strong></div><div><small>PRÓXIMA AULA</small><strong className="small-value">{selectedStudent.nextClass}</strong></div></div><div className="drawer-section"><span className="panel-kicker">CONTATO</span><a href={`mailto:${selectedStudent.email}`}><Mail size={16}/>{selectedStudent.email}</a><a href={`tel:${selectedStudent.phone}`}><Phone size={16}/>{selectedStudent.phone}</a></div><div className="drawer-section"><span className="panel-kicker">ACOMPANHAMENTO</span><div className="drawer-progress"><span>Evolução no curso <b>{selectedStudent.progress}%</b></span><ProgressBar value={selectedStudent.progress}/></div><div className="drawer-progress"><span>Frequência nas aulas <b>{selectedStudent.attendance}%</b></span><ProgressBar value={selectedStudent.attendance} tone="green"/></div></div><div className="drawer-section"><span className="panel-kicker">PROFESSOR RESPONSÁVEL</span><div className="teacher-line"><GraduationCap size={18}/><strong>{selectedStudent.teacher}</strong></div></div><footer><button className="button button-secondary" onClick={()=>{setSelectedStudent(null);navigate("pedagogy");}}><BookOpenCheck size={16}/>Ver pedagógico</button><button className="button button-primary" onClick={()=>openModal("edit-student",selectedStudent)}><Pencil size={16}/>Editar aluno</button></footer></aside></>}
    {assistantOpen&&<><button className="drawer-scrim" onClick={()=>setAssistantOpen(false)} aria-label="Fechar assistente"/><aside className="assistant-drawer"><header><div className="assistant-title"><span className="assistant-symbol"><BrainCircuit size={21}/><i/></span><div><span className="panel-kicker">INTELIGÊNCIA OPERACIONAL</span><h2>N.O.T.E.</h2></div></div><button className="icon-button" onClick={()=>setAssistantOpen(false)} aria-label="Fechar"><X size={19}/></button></header><div className="assistant-context"><span><i/>CONECTADO AO AMBIENTE LOCAL</span><p>Respostas calculadas a partir dos dados desta demonstração.</p></div><div className="chat-messages">{messages.map((m,i)=><div key={i} className={`chat-message chat-${m.from}`}>{m.from==="bot"&&<Bot size={17}/>}<p>{m.text}</p></div>)}</div><div className="chat-suggestions">{["Resuma os pagamentos em atraso","Como está a agenda de hoje?","Quais alunos têm risco de frequência?"].map(q=><button key={q} onClick={()=>sendAssistant(q)}>{q}<ArrowUpRight size={13}/></button>)}</div><form className="chat-input" onSubmit={e=>{e.preventDefault();sendAssistant();}}><input value={assistantInput} onChange={e=>setAssistantInput(e.target.value)} placeholder="Pergunte sobre a escola..." aria-label="Mensagem para o assistente"/><button className="button button-primary" type="submit" aria-label="Enviar mensagem"><Send size={17}/></button></form></aside></>}
    {modal&&modal.type!=="reset"&&<EntityModal modal={modal} students={students} onClose={()=>setModal(null)} onSubmit={handleSubmit}/>} 
    {modal?.type==="reset"&&<Modal title="Restaurar demonstração?" subtitle="Esta ação substitui todos os dados locais pelos registros originais." onClose={()=>setModal(null)}><div className="confirm-content"><AlertTriangle size={30}/><p>Exporte um backup antes se quiser preservar as alterações feitas neste navegador.</p></div><footer className="modal-actions"><button className="button button-secondary" onClick={()=>setModal(null)}>Cancelar</button><button className="button button-danger" onClick={resetData}><RotateCcw size={16}/>Sim, restaurar</button></footer></Modal>}
    {toast&&<div className={`toast toast-${toast.tone}`} role="status"><CheckCircle2 size={19}/><span>{toast.text}</span><button onClick={()=>setToast(null)} aria-label="Fechar aviso"><X size={15}/></button></div>}
  </div>;
}

export default App;
