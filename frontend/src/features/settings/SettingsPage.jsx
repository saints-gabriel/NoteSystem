import { useState } from "react";
import { Bell, ChevronRight, Database, Download, RotateCcw, Save, Settings, ShieldCheck } from "lucide-react";
import { AsyncContent, Badge, Field, PageTitle } from "../../components/ui/index.js";
import { ROLES } from "../../config/roles.js";
import { useSession } from "../../context/SessionContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useWorkspaceUi } from "../../context/WorkspaceUiContext.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { getSettings, saveSettings } from "../../services/settingsService.js";
import { ResetDemoModal } from "./ResetDemoModal.jsx";
import { useBackupExport } from "./useBackupExport.js";

const TABS = [
  { name: "Geral", icon: Settings },
  { name: "Notificações", icon: Bell },
  { name: "Dados & privacidade", icon: ShieldCheck },
];

const NOTIFICATION_OPTIONS = [
  ["payments", "Cobranças e vencimentos", "Receba alertas de mensalidades pendentes e em atraso."],
  ["classes", "Alterações na agenda", "Saiba quando uma aula for criada ou reagendada."],
  ["insights", "Insights semanais", "Receba um resumo de desempenho toda segunda-feira."],
];

export function SettingsPage() {
  const query = useAsync(getSettings, []);
  return <AsyncContent query={query}>{(settings) => <SettingsForm settings={settings} />}</AsyncContent>;
}

function SettingsForm({ settings }) {
  const { user } = useSession();
  const { showToast } = useToast();
  const exportBackup = useBackupExport();
  const [tab, setTab] = useState(TABS[0].name);
  const [draft, setDraft] = useState(settings);
  const [confirmReset, setConfirmReset] = useState(false);
  const isAdmin = user.role === ROLES.ADMIN;

  const set = (field) => (event) => setDraft({ ...draft, [field]: event.target.value });

  const save = async () => {
    try {
      setDraft(await saveSettings(draft));
      showToast("Preferências salvas.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="view">
      <PageTitle
        eyebrow="SISTEMA / PREFERÊNCIAS"
        title="Configurações"
        description="Ajuste o NoteSystem ao funcionamento da sua escola."
        actions={
          <button
            className="button button-primary"
            onClick={save}
            disabled={!isAdmin}
            title={isAdmin ? undefined : "Apenas administradores"}
          >
            <Save size={16} />
            Salvar alterações
          </button>
        }
      />
      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Seções de configurações">
          {TABS.map(({ name, icon: Icon }) => (
            <button key={name} className={tab === name ? "active" : ""} onClick={() => setTab(name)}>
              <Icon size={17} /> {name}
              <ChevronRight size={15} />
            </button>
          ))}
        </nav>
        <section className="panel settings-panel">
          {tab === "Geral" && <GeneralTab draft={draft} set={set} readOnly={!isAdmin} />}
          {tab === "Notificações" && (
            <div className="toggle-list">
              {NOTIFICATION_OPTIONS.map(([key, title, text]) => (
                <label key={key}>
                  <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft[key]}
                    disabled={!isAdmin}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.checked })}
                  />
                  <span className="toggle-ui" />
                </label>
              ))}
            </div>
          )}
          {tab === "Dados & privacidade" && (
            <DataTab isAdmin={isAdmin} onExport={exportBackup} onReset={() => setConfirmReset(true)} />
          )}
        </section>
      </div>
      {confirmReset && <ResetDemoModal onClose={() => setConfirmReset(false)} />}
    </div>
  );
}

function GeneralTab({ draft, set, readOnly }) {
  const fields = [
    { name: "schoolName", label: "Nome da escola", full: true },
    { name: "email", label: "E-mail administrativo", type: "email" },
    { name: "phone", label: "Telefone", type: "tel" },
    { name: "openTime", label: "Início da operação", type: "time" },
    { name: "closeTime", label: "Encerramento", type: "time" },
    { name: "revenueGoal", label: "Meta mensal de receita (R$)", type: "number" },
  ];
  return (
    <>
      <header>
        <span className="panel-kicker">IDENTIDADE DA ESCOLA</span>
        <h2>Informações gerais</h2>
        <p>
          Estes dados aparecem nos relatórios e comunicações.
          {readOnly && " Somente administradores podem editar."}
        </p>
      </header>
      <div className="form-grid">
        {fields.map(({ name, label, type = "text", full }) => (
          <Field key={name} label={label} full={full}>
            <input
              type={type}
              min={type === "number" ? 0 : undefined}
              value={draft[name] ?? ""}
              disabled={readOnly}
              onChange={set(name)}
            />
          </Field>
        ))}
      </div>
      <div className="theme-setting">
        <div>
          <strong>Aparência do sistema</strong>
          <p>Interface otimizada para foco e baixa luminosidade.</p>
        </div>
        <Badge tone="yellow" dot>
          Dark / sempre ativo
        </Badge>
      </div>
    </>
  );
}

function DataTab({ isAdmin, onExport, onReset }) {
  return (
    <>
      <header>
        <span className="panel-kicker">CONTROLE / LGPD</span>
        <h2>Dados & privacidade</h2>
        <p>Exporte uma cópia dos registros ou restaure o ambiente de demonstração.</p>
      </header>
      {isAdmin ? (
        <div className="data-actions">
          <article>
            <Database size={23} />
            <div>
              <strong>Backup dos dados</strong>
              <p>Baixe todos os registros da escola em formato JSON.</p>
            </div>
            <button className="button button-secondary" onClick={onExport}>
              <Download size={16} />
              Exportar backup
            </button>
          </article>
          <article className="danger-zone">
            <RotateCcw size={23} />
            <div>
              <strong>Restaurar demonstração</strong>
              <p>Substitui os dados da API pelos registros originais de demonstração.</p>
            </div>
            <button className="button button-danger" onClick={onReset}>
              <RotateCcw size={16} />
              Restaurar dados
            </button>
          </article>
        </div>
      ) : (
        <div className="privacy-note">
          <ShieldCheck size={20} />
          <p>Backup e restauração estão disponíveis apenas para administradores.</p>
        </div>
      )}
    </>
  );
}
