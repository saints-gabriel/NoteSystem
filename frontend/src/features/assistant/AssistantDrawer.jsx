import { useState } from "react";
import { ArrowUpRight, Bot, BrainCircuit, Send, X } from "lucide-react";
import { useResource } from "../../context/ResourceContext.jsx";
import { useSession } from "../../context/SessionContext.jsx";
import { useWorkspaceUi } from "../../context/WorkspaceUiContext.jsx";
import { useKeydown } from "../../hooks/useKeydown.js";
import { firstName } from "../../utils/format.js";
import { ASSISTANT_SUGGESTIONS, answerQuestion } from "./assistantEngine.js";

export function AssistantDrawer() {
  const { assistantOpen, closeAssistant } = useWorkspaceUi();
  useKeydown((event) => event.key === "Escape" && closeAssistant());
  if (!assistantOpen) return null;
  return <AssistantPanel onClose={closeAssistant} />;
}

function AssistantPanel({ onClose }) {
  const { user } = useSession();
  const students = useResource("students");
  const classes = useResource("classes");
  const transactions = useResource("transactions");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: `Olá, ${firstName(user.name)}. Sou o N.O.T.E., seu assistente operacional. Posso resumir alunos, agenda e finanças da escola.`,
    },
  ]);

  const ready = !students.loading && !classes.loading && !transactions.loading;

  const send = (text = input) => {
    const question = text.trim();
    if (!question || !ready) return;
    const answer = answerQuestion(question, {
      students: students.items,
      classes: classes.items,
      transactions: transactions.items,
    });
    setMessages((current) => [...current, { from: "user", text: question }]);
    setInput("");
    setTimeout(() => setMessages((current) => [...current, { from: "bot", text: answer }]), 280);
  };

  return (
    <>
      <button className="drawer-scrim" onClick={onClose} aria-label="Fechar assistente" />
      <aside className="assistant-drawer">
        <header>
          <div className="assistant-title">
            <span className="assistant-symbol">
              <BrainCircuit size={21} />
              <i />
            </span>
            <div>
              <span className="panel-kicker">INTELIGÊNCIA OPERACIONAL</span>
              <h2>N.O.T.E.</h2>
            </div>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar">
            <X size={19} />
          </button>
        </header>
        <div className="assistant-context">
          <span>
            <i />
            CONECTADO À API
          </span>
          <p>Respostas calculadas a partir dos dados atuais da escola.</p>
        </div>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`chat-message chat-${message.from}`}>
              {message.from === "bot" && <Bot size={17} />}
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <div className="chat-suggestions">
          {ASSISTANT_SUGGESTIONS.map((suggestion) => (
            <button key={suggestion} onClick={() => send(suggestion)}>
              {suggestion}
              <ArrowUpRight size={13} />
            </button>
          ))}
        </div>
        <form
          className="chat-input"
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre a escola..."
            aria-label="Mensagem para o assistente"
          />
          <button
            className="button button-primary"
            type="submit"
            aria-label="Enviar mensagem"
            disabled={!ready}
          >
            <Send size={17} />
          </button>
        </form>
      </aside>
    </>
  );
}
