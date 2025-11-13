import { AlertCircle, MessageSquare, User, ShieldAlert } from "lucide-react";
import "./ActivityFeed.css";

interface ActivityEvent {
  id: string;
  type:
    | "manual-message"
    | "profile-update"
    | "block-alert"
    | "consent-required";
  title: string;
  description: string;
  timestamp: string;
}

const feedData: ActivityEvent[] = [
  {
    id: "1",
    type: "manual-message",
    title: "Mensagem manual enviada",
    description:
      "Operador Ana enviou mensagem de boas-vindas via número SP 01.",
    timestamp: "Há 4 minutos",
  },
  {
    id: "2",
    type: "profile-update",
    title: "Foto de perfil atualizada",
    description: "Número Suporte RJ 02 alterou a imagem de perfil.",
    timestamp: "Há 16 minutos",
  },
  {
    id: "3",
    type: "consent-required",
    title: "Consentimento pendente",
    description: "Número Vendas MG 07 sem opt-in documentado.",
    timestamp: "Há 32 minutos",
  },
  {
    id: "4",
    type: "block-alert",
    title: "Bloqueio identificado",
    description:
      "WhatsApp sinalizou restrição temporária no número Leads Norte.",
    timestamp: "Há 1 hora",
  },
];

const iconMap = {
  "manual-message": <MessageSquare size={18} />,
  "profile-update": <User size={18} />,
  "block-alert": <ShieldAlert size={18} />,
  "consent-required": <AlertCircle size={18} />,
};

export function ActivityFeed() {
  return (
    <aside className="activity-feed">
      <header className="activity-feed-header">
        <h3>Feed de Eventos</h3>
        <span>Logs recentes do ecossistema</span>
      </header>

      <div className="activity-feed-timeline">
        {feedData.map((event) => (
          <div key={event.id} className={`activity-feed-item ${event.type}`}>
            <div className="activity-feed-icon">{iconMap[event.type]}</div>

            <div className="activity-feed-content">
              <div className="activity-feed-title">
                <strong>{event.title}</strong>
                <time>{event.timestamp}</time>
              </div>
              <p>{event.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="activity-feed-more">
        Ver todos os registros
      </button>
    </aside>
  );
}
