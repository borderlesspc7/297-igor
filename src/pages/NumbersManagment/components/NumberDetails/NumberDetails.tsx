import { useState } from "react";
import {
  X,
  Phone,
  Calendar,
  TrendingUp,
  MessageSquare,
  Shield,
  BarChart3,
  Edit,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
} from "lucide-react";
import type {
  NumberDetails as NumberDetailsType,
  InteractionType,
} from "../../../../types/number";
import { InteractionModal } from "../InteractionModal/InteractionModal";
import { numberService } from "../../../../services/numberService";
import "./NumberDetails.css";

type NumberDetailsProps = {
  number: NumberDetailsType;
  onClose: () => void;
  onUpdate: () => void;
};

export function NumberDetails({
  number,
  onClose,
  onUpdate,
}: NumberDetailsProps) {
  const [showInteractionModal, setShowInteractionModal] = useState(false);

  const formatDate = (date?: Date) => {
    if (!date) return "Não informado";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (date?: Date) => {
    if (!date) return "Não informado";
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { label: string; class: string; icon: React.ReactNode }
    > = {
      aquecendo: {
        label: "Aquecendo",
        class: "heating",
        icon: <TrendingUp size={18} />,
      },
      pausado: {
        label: "Pausado",
        class: "paused",
        icon: <Clock size={18} />,
      },
      pronto: {
        label: "Pronto",
        class: "ready",
        icon: <CheckCircle2 size={18} />,
      },
      banido: {
        label: "Banido",
        class: "banned",
        icon: <AlertTriangle size={18} />,
      },
    };
    return configs[status] || configs.pausado;
  };

  const handleRegisterInteraction = async (
    numberId: string,
    interaction: {
      type: InteractionType;
      description: string;
      metadata?: Record<string, unknown>;
    }
  ) => {
    await numberService.registerInteraction(numberId, {
      type: interaction.type,
      description: interaction.description,
      metadata: interaction.metadata,
    });
    onUpdate();
    setShowInteractionModal(false);
  };

  const statusConfig = getStatusConfig(number.status);

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-container number-details-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="details-header">
            <button type="button" className="close-button" onClick={onClose}>
              <X size={20} />
            </button>
            <div className="details-profile">
              {number.profilePhoto ? (
                <img src={number.profilePhoto} alt={number.displayName} />
              ) : (
                <div className="profile-placeholder">
                  <Phone size={32} />
                </div>
              )}
              <div>
                <h1>{number.displayName}</h1>
                <p>{number.number}</p>
                <span className={`status-badge ${statusConfig.class}`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </header>

          <div className="details-content">
            <section className="details-section">
              <h2>Informações do Número</h2>
              <div className="info-grid">
                <div className="info-item">
                  <Calendar size={18} />
                  <div>
                    <span className="info-label">Data de Início</span>
                    <strong>{formatDate(number.heatingStartDate)}</strong>
                  </div>
                </div>
                <div className="info-item">
                  <Phone size={18} />
                  <div>
                    <span className="info-label">Operadora</span>
                    <strong>{number.operator || "Não informado"}</strong>
                  </div>
                </div>
                <div className="info-item">
                  <Users size={18} />
                  <div>
                    <span className="info-label">Empresa</span>
                    <strong>{number.company}</strong>
                  </div>
                </div>
                <div className="info-item">
                  <TrendingUp size={18} />
                  <div>
                    <span className="info-label">Progresso</span>
                    <strong>{number.progressPercent}%</strong>
                  </div>
                </div>
              </div>
            </section>

            {number.health && (
              <section className="details-section">
                <h2>
                  <Shield size={18} />
                  Saúde do Número
                </h2>
                <div className="health-grid">
                  <div className="health-card">
                    <BarChart3 size={18} />
                    <div>
                      <span className="health-label">Taxa de Respostas</span>
                      <strong className="health-value success">
                        {number.health.responseRate.toFixed(1)}%
                      </strong>
                    </div>
                  </div>
                  <div className="health-card">
                    <AlertTriangle size={24} />
                    <div>
                      <span className="health-label">Taxa de Bloqueios</span>
                      <strong className="health-value warning">
                        {number.health.blockRate.toFixed(1)}%
                      </strong>
                    </div>
                  </div>
                  <div className="health-card">
                    <MessageSquare size={18} />
                    <div>
                      <span className="health-label">
                        Mensagens/Dia (Média)
                      </span>
                      <strong className="health-value">
                        {number.health.averageMessagesPerDay.toFixed(0)}
                      </strong>
                    </div>
                  </div>
                  <div className="health-card">
                    <TrendingUp size={24} />
                    <div>
                      <span className="health-label">
                        Diversidade de Formatos
                      </span>
                      <div className="format-diversity">
                        <span>
                          Texto: {number.health.formatDiversity.text}%
                        </span>
                        <span>
                          Áudio: {number.health.formatDiversity.audio}%
                        </span>
                        <span>
                          Imagem: {number.health.formatDiversity.image}%
                        </span>
                        {number.health.formatDiversity.video > 0 && (
                          <span>
                            Vídeo: {number.health.formatDiversity.video}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="details-section">
              <div className="section-header">
                <h2>
                  <Clock size={20} />
                  Histórico de Interações
                </h2>
                <button
                  type="button"
                  className="btn-register-interaction"
                  onClick={() => setShowInteractionModal(true)}
                >
                  <MessageSquare size={18} />
                  Registrar Interação
                </button>
              </div>
              {number.interactions.length === 0 ? (
                <div className="empty-timeline">
                  Nenhuma interação registrada ainda
                </div>
              ) : (
                <div className="timeline">
                  {number.interactions.map((interaction) => (
                    <div key={interaction.id} className="timeline-item">
                      <div className="timeline-dot" />
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <strong>{interaction.description}</strong>
                          <time>{formatDateTime(interaction.timestamp)}</time>
                        </div>
                        <span className="timeline-type">
                          {interaction.type}
                        </span>
                        {interaction.createdBy && (
                          <span className="timeline-author">
                            Registrado por: {interaction.createdBy}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <footer className="details-footer">
            <button type="button" className="btn-secondary">
              <Edit size={18} />
              Editar Número
            </button>
            <button type="button" className="btn-secondary">
              Ver Histórico completo
            </button>
          </footer>
        </div>
      </div>

      {showInteractionModal && (
        <InteractionModal
          numberId={number.id}
          numberName={number.displayName}
          onClose={() => setShowInteractionModal(false)}
          onSubmit={handleRegisterInteraction}
        />
      )}
    </>
  );
}
