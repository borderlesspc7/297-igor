import { useState } from "react";
import {
  X,
  User,
  Building2,
  Mail,
  Phone,
  FileText,
  Calendar,
  TrendingUp,
  Hash,
  Edit,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import type { ClientDetails as ClientDetailsType } from "../../../../types/client";
import { EditClientModal } from "../EditClientModal/EditClientModal";
import "./ClientDetails.css";

type ClientDetailsProps = {
  client: ClientDetailsType;
  onClose: () => void;
  onUpdate: () => void;
};

export function ClientDetails({
  client,
  onClose,
  onUpdate,
}: ClientDetailsProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; class: string }> = {
      ativo: { label: "Ativo", class: "active" },
      inativo: { label: "Inativo", class: "inactive" },
      suspenso: { label: "Suspenso", class: "suspended" },
      cancelado: { label: "Cancelado", class: "cancelled" },
    };
    return configs[status] || configs.ativo;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const statusConfig = getStatusBadge(client.status);

  return (
    <>
      <div className="client-details-overlay" onClick={onClose}>
        <div
          className="client-details-container"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="client-details-header">
            <div className="client-details-title">
              <Building2 size={24} />
              <div>
                <h2>{client.company}</h2>
                <p>{client.name}</p>
              </div>
            </div>
            <div className="client-details-actions">
              <button
                type="button"
                className="btn-edit"
                onClick={() => setShowEditModal(true)}
              >
                <Edit size={18} />
                Editar
              </button>
              <button type="button" className="btn-close" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
          </header>

          <div className="client-details-content">
            {/* Status Badge */}
            <div className="client-details-status">
              <span className={`status-badge-large ${statusConfig.class}`}>
                {statusConfig.label}
              </span>
            </div>

            {/* Informações Básicas */}
            <section className="client-details-section">
              <h3>Informações Básicas</h3>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon">
                    <User size={20} />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Responsável</span>
                    <strong className="info-value">{client.name}</strong>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <Building2 size={20} />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Empresa</span>
                    <strong className="info-value">{client.company}</strong>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <Mail size={20} />
                  </div>
                  <div className="info-content">
                    <span className="info-label">E-mail</span>
                    <strong className="info-value">{client.email}</strong>
                  </div>
                </div>

                {client.phone && (
                  <div className="info-item">
                    <div className="info-icon">
                      <Phone size={20} />
                    </div>
                    <div className="info-content">
                      <span className="info-label">Telefone</span>
                      <strong className="info-value">{client.phone}</strong>
                    </div>
                  </div>
                )}

                {client.document && (
                  <div className="info-item">
                    <div className="info-icon">
                      <FileText size={20} />
                    </div>
                    <div className="info-content">
                      <span className="info-label">CPF/CNPJ</span>
                      <strong className="info-value">{client.document}</strong>
                    </div>
                  </div>
                )}

                <div className="info-item">
                  <div className="info-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Cadastrado em</span>
                    <strong className="info-value">
                      {formatDate(client.createdAt)}
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            {/* Estatísticas */}
            <section className="client-details-section">
              <h3>Estatísticas</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Hash size={24} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Total de Números</span>
                    <strong className="stat-value">
                      {client.totalNumbers}
                    </strong>
                  </div>
                </div>

                <div className="stat-card active">
                  <div className="stat-icon">
                    <TrendingUp size={24} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Números Ativos</span>
                    <strong className="stat-value">
                      {client.activeNumbers}
                    </strong>
                  </div>
                </div>

                {client.plan && (
                  <div className="stat-card">
                    <div className="stat-icon">
                      <CreditCard size={24} />
                    </div>
                    <div className="stat-content">
                      <span className="stat-label">Plano</span>
                      <strong className="stat-value">
                        {client.plan.charAt(0).toUpperCase() +
                          client.plan.slice(1)}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Informações de Billing */}
            {client.billingInfo && (
              <section className="client-details-section">
                <h3>Informações de Cobrança</h3>
                <div className="billing-info">
                  <div className="billing-item">
                    <span className="billing-label">Plano:</span>
                    <strong className="billing-value">
                      {client.billingInfo.plan}
                    </strong>
                  </div>
                  <div className="billing-item">
                    <span className="billing-label">Valor Mensal:</span>
                    <strong className="billing-value">
                      R$ {client.billingInfo.monthlyValue.toFixed(2)}
                    </strong>
                  </div>
                  {client.billingInfo.nextBilling && (
                    <div className="billing-item">
                      <span className="billing-label">Próxima Cobrança:</span>
                      <strong className="billing-value">
                        {formatDate(client.billingInfo.nextBilling)}
                      </strong>
                    </div>
                  )}
                  {client.billingInfo.paymentMethod && (
                    <div className="billing-item">
                      <span className="billing-label">
                        Método de Pagamento:
                      </span>
                      <strong className="billing-value">
                        {client.billingInfo.paymentMethod}
                      </strong>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Números Associados */}
            <section className="client-details-section">
              <h3>Números Associados</h3>
              {client.numbers && client.numbers.length > 0 ? (
                <div className="numbers-list">
                  {client.numbers.map((number) => (
                    <div key={number.id} className="number-item">
                      <div className="number-info">
                        <Hash size={18} />
                        <div>
                          <strong className="number-value">
                            {number.number}
                          </strong>
                          <span className="number-name">
                            {number.displayName}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`number-status ${
                          number.status === "pronto" ? "ready" : "other"
                        }`}
                      >
                        {number.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <AlertCircle size={48} />
                  <p>Nenhum número associado a este cliente</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditClientModal
          client={client}
          onClose={() => setShowEditModal(false)}
          onUpdate={() => {
            setShowEditModal(false);
            onUpdate();
            onClose();
          }}
        />
      )}
    </>
  );
}
