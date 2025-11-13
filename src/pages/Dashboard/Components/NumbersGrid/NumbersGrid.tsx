import { Pause, Settings2, ExternalLink } from "lucide-react";
import "./NumbersGrid.css";

interface NumberItem {
  id: string;
  name: string;
  avatar: string;
  heatingPercent: number;
  lastActivity: string;
  status: "aquecendo" | "pronto" | "pausado";
}

const mockNumbers: NumberItem[] = [
  {
    id: "1",
    name: "Atendimento SP 01",
    avatar: "https://i.pravatar.cc/80?img=12",
    heatingPercent: 82,
    lastActivity: "Há 15 minutos",
    status: "aquecendo",
  },
  {
    id: "2",
    name: "Suporte RJ 02",
    avatar: "https://i.pravatar.cc/80?img=23",
    heatingPercent: 100,
    lastActivity: "Há 2 minutos",
    status: "pronto",
  },
  {
    id: "3",
    name: "Vendas MG 07",
    avatar: "https://i.pravatar.cc/80?img=45",
    heatingPercent: 56,
    lastActivity: "Há 42 minutos",
    status: "aquecendo",
  },
  {
    id: "4",
    name: "Captura Leads Norte",
    avatar: "https://i.pravatar.cc/80?img=18",
    heatingPercent: 32,
    lastActivity: "Há 1 hora",
    status: "pausado",
  },
];

export function NumbersGrid() {
  return (
    <section className="numbers-grid">
      <div className="numbers-grid-header">
        <div>
          <h3>Números em destaque</h3>
          <p>Monitoramento rápido dos principais chips operando</p>
        </div>
        <button type="button" className="numbers-grid-manual">
          Iniciar sessão manual
        </button>
      </div>

      <div className="numbers-grid-list">
        {mockNumbers.map((item) => (
          <article className="number-card" key={item.id}>
            <header className="number-card-header">
              <img src={item.avatar} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <span className={`status-badge ${item.status}`}>
                  {item.status === "pronto"
                    ? "Pronto"
                    : item.status === "aquecendo"
                    ? "Em aquecimento"
                    : "Pausado"}
                </span>
              </div>
            </header>

            <div className="number-card-progress">
              <div className="progress-bar">
                <div
                  className={`progress-fill ${item.status}`}
                  style={{ width: `${item.heatingPercent}%` }}
                />
              </div>
              <span>{item.heatingPercent}% concluído</span>
            </div>

            <footer className="number-card-footer">
              <div className="number-card-meta">
                <small>Última atividade</small>
                <strong>{item.lastActivity}</strong>
              </div>

              <div className="number-card-actions">
                <button type="button" title="Visualizar detalhes">
                  <ExternalLink size={18} />
                </button>
                <button type="button" title="Pausar aquecimento">
                  <Pause size={18} />
                </button>
                <button type="button" title="Configurar plano">
                  <Settings2 size={18} />
                </button>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
