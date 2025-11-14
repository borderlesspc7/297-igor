import {
  Eye,
  Settings2,
  MessageSquare,
  Pause,
  Play,
  CheckSquare,
  Square,
} from "lucide-react";
import type { PhoneNumber, NumberStatus } from "../../../../types/number";
import "./NumberList.css";

type NumberListProps = {
  numbers: PhoneNumber[];
  selectedNumbers: string[];
  onSelectionChange: (ids: string[]) => void;
  onViewDetails: (id: string) => void;
  onUpdateStatus: (id: string, status: NumberStatus) => void;
  onRegisterInteraction?: (id: string) => void;
  onConfigurePlan?: (id: string) => void;
};

export function NumberList({
  numbers,
  selectedNumbers,
  onSelectionChange,
  onViewDetails,
  onUpdateStatus,
  onRegisterInteraction,
  onConfigurePlan,
}: NumberListProps) {
  const handleSelectAll = () => {
    if (selectedNumbers.length === numbers.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(numbers.map((n) => n.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedNumbers.includes(id)) {
      onSelectionChange(selectedNumbers.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedNumbers, id]);
    }
  };

  const getStatusBadge = (status: NumberStatus) => {
    const configs = {
      aquecendo: { label: "Aquecendo", class: "heating" },
      pausado: { label: "Pausado", class: "paused" },
      pronto: { label: "Pronto", class: "ready" },
      banido: { label: "Banido", class: "banned" },
    };
    return configs[status];
  };

  const formatLastActivity = (date?: Date) => {
    if (!date) return "Nunca";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `Há ${minutes} min`;
    if (hours < 24) return `Há ${hours}h`;
    return `Há ${days} dias`;
  };

  return (
    <div className="number-list-container">
      <div className="number-list-header">
        <div className="number-list-select-all">
          <button
            type="button"
            onClick={handleSelectAll}
            className="select-all-button"
          >
            {selectedNumbers.length === numbers.length ? (
              <CheckSquare size={20} />
            ) : (
              <Square size={20} />
            )}
            <span>
              {selectedNumbers.length > 0
                ? `${selectedNumbers.length} selecionados`
                : "Selecionar todos"}
            </span>
          </button>
        </div>
      </div>

      <div className="number-list-table">
        <table>
          <thead>
            <tr>
              <th className="checkbox-col"></th>
              <th>Número</th>
              <th>Empresa</th>
              <th>Status</th>
              <th>Última Ação</th>
              <th>Progresso</th>
              <th className="actions-col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {numbers.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  Nenhum número encontrado
                </td>
              </tr>
            ) : (
              numbers.map((number) => {
                const isSelected = selectedNumbers.includes(number.id);
                const statusConfig = getStatusBadge(number.status);

                return (
                  <tr key={number.id} className={isSelected ? "selected" : ""}>
                    <td className="checkbox-col">
                      <button
                        type="button"
                        onClick={() => handleSelectOne(number.id)}
                        className="checkbox-button"
                      >
                        {isSelected ? (
                          <CheckSquare size={18} />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                    </td>
                    <td>
                      <div className="number-cell">
                        {number.profilePhoto && (
                          <img
                            src={number.profilePhoto}
                            alt={number.displayName}
                          />
                        )}
                        <div>
                          <strong>{number.displayName}</strong>
                          <span>{number.number}</span>
                        </div>
                      </div>
                    </td>
                    <td>{number.company}</td>
                    <td>
                      <span className={`status-badge ${statusConfig.class}`}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="last-activity">
                      {formatLastActivity(number.lastActivity)}
                    </td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${number.progressPercent}%` }}
                          />
                        </div>
                        <span>{number.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="actions-col">
                      <div className="action-buttons">
                        <button
                          type="button"
                          onClick={() => onViewDetails(number.id)}
                          title="Ver Detalhes"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onConfigurePlan?.(number.id)}
                          title="Configurar Plano"
                        >
                          <Settings2 size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRegisterInteraction?.(number.id)}
                          title="Registrar Interação Manual"
                        >
                          <MessageSquare size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateStatus(
                              number.id,
                              number.status === "pausado"
                                ? "aquecendo"
                                : "pausado"
                            )
                          }
                          title={
                            number.status === "pausado" ? "Reaquecer" : "Pausar"
                          }
                        >
                          {number.status === "pausado" ? (
                            <Play size={18} />
                          ) : (
                            <Pause size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
