import {
  Eye,
  Edit,
  Trash2,
  CheckSquare,
  Square,
  Building2,
  Mail,
  Phone,
  TrendingUp,
} from "lucide-react";
import type { Client, ClientStatus } from "../../../../types/client";
import "./ClientList.css";

type ClientListProps = {
  clients: Client[];
  selectedClients: string[];
  onSelectionChange: (ids: string[]) => void;
  onViewDetails: (id: string) => void;
  onUpdateStatus: (id: string, status: ClientStatus) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function ClientList({
  clients,
  selectedClients,
  onSelectionChange,
  onViewDetails,
  onEdit,
  onDelete,
}: ClientListProps) {
  const handleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(clients.map((c) => c.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedClients.includes(id)) {
      onSelectionChange(selectedClients.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedClients, id]);
    }
  };

  const getStatusBadge = (status: ClientStatus) => {
    const configs = {
      ativo: { label: "Ativo", class: "active" },
      inativo: { label: "Inativo", class: "inactive" },
      suspenso: { label: "Suspenso", class: "suspended" },
      cancelado: { label: "Cancelado", class: "cancelled" },
    };
    return configs[status];
  };

  return (
    <div className="client-list-container">
      <div className="client-list-header">
        <div className="client-list-select-all">
          <button
            type="button"
            onClick={handleSelectAll}
            className="select-all-button"
          >
            {selectedClients.length === clients.length ? (
              <CheckSquare size={20} />
            ) : (
              <Square size={20} />
            )}
            <span>
              {selectedClients.length > 0
                ? `${selectedClients.length} selecionados`
                : "Selecionar todos"}
            </span>
          </button>
        </div>
      </div>

      <div className="client-list-grid">
        {clients.length === 0 ? (
          <div className="empty-state">Nenhum cliente encontrado</div>
        ) : (
          clients.map((client) => {
            const isSelected = selectedClients.includes(client.id);
            const statusConfig = getStatusBadge(client.status);

            return (
              <article
                key={client.id}
                className={`client-card ${isSelected ? "selected" : ""}`}
              >
                <div className="client-card-header">
                  <div className="client-card-checkbox">
                    <button
                      type="button"
                      onClick={() => handleSelectOne(client.id)}
                      className="checkbox-button"
                    >
                      {isSelected ? (
                        <CheckSquare size={18} />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                  </div>

                  <div className="client-card-info">
                    <div className="client-card-name">
                      <Building2 size={20} />
                      <div>
                        <strong>{client.name}</strong>
                        <span>{client.company}</span>
                      </div>
                    </div>
                    <span className={`status-badge ${statusConfig.class}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                <div className="client-card-body">
                  <div className="client-info-item">
                    <Mail size={16} />
                    <span>{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="client-info-item">
                      <Phone size={16} />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.plan && (
                    <div className="client-info-item">
                      <TrendingUp size={16} />
                      <span>Plano: {client.plan}</span>
                    </div>
                  )}
                </div>

                <div className="client-card-stats">
                  <div className="client-stat">
                    <span className="stat-label">Total</span>
                    <strong className="stat-value">
                      {client.totalNumbers}
                    </strong>
                  </div>
                  <div className="client-stat">
                    <span className="stat-label">Ativos</span>
                    <strong className="stat-value active">
                      {client.activeNumbers}
                    </strong>
                  </div>
                </div>

                <div className="client-card-actions">
                  <button
                    type="button"
                    onClick={() => onViewDetails(client.id)}
                    title="Ver Detalhes"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit?.(client.id)}
                    title="Editar Cliente"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(client.id)}
                    title="Deletar Cliente"
                    className="danger"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
