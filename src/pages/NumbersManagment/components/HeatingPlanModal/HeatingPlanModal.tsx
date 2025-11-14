import { useState, type FormEvent } from "react";
import { X, MessageSquare, Target, Settings2 } from "lucide-react";
import "./HeatingPlanModal.css";

type HeatingPlanModalProps = {
  numberId: string;
  numberName: string;
  existingPlan?: {
    dailyMessageLimit: number;
    weeklyMessageLimit: number;
    messageTypes: ("text" | "audio" | "image" | "video")[];
    interactionRequirements: {
      responseRate?: number;
      groupJoins?: number;
      manualInteractions?: number;
    };
  };
  onClose: () => void;
  onSubmit: (plan: {
    dailyMessageLimit: number;
    weeklyMessageLimit: number;
    messageTypes: ("text" | "audio" | "image" | "video")[];
    interactionRequirements: {
      responseRate?: number;
      groupJoins?: number;
      manualInteractions?: number;
    };
  }) => Promise<void>;
};

export function HeatingPlanModal({
  numberId,
  numberName,
  existingPlan,
  onClose,
  onSubmit,
}: HeatingPlanModalProps) {
  const [dailyLimit, setDailyLimit] = useState(
    existingPlan?.dailyMessageLimit || 50
  );
  const [weeklyLimit, setWeeklyLimit] = useState(
    existingPlan?.weeklyMessageLimit || 300
  );
  const [messageTypes, setMessageTypes] = useState<
    ("text" | "audio" | "image" | "video")[]
  >(existingPlan?.messageTypes || ["text"]);
  const [responseRate, setResponseRate] = useState(
    existingPlan?.interactionRequirements?.responseRate || 60
  );
  const [groupJoins, setGroupJoins] = useState(
    existingPlan?.interactionRequirements?.groupJoins || 2
  );
  const [manualInteractions, setManualInteractions] = useState(
    existingPlan?.interactionRequirements?.manualInteractions || 5
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMessageTypeToggle = (
    type: "text" | "audio" | "image" | "video"
  ) => {
    if (messageTypes.includes(type)) {
      setMessageTypes(messageTypes.filter((t) => t !== type));
    } else {
      setMessageTypes([...messageTypes, type]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (messageTypes.length === 0) {
      setError("Selecione pelo menos um tipo de mensagem");
      return;
    }

    if (weeklyLimit < dailyLimit) {
      setError("O limite semanal deve ser maior ou igual ao diário");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        dailyMessageLimit: dailyLimit,
        weeklyMessageLimit: weeklyLimit,
        messageTypes,
        interactionRequirements: {
          responseRate,
          groupJoins,
          manualInteractions,
        },
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao configurar plano");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container heating-plan-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <h2>
              <Settings2 size={20} />
              Configurar Plano de Aquecimento
            </h2>
            <p>{numberName}</p>
          </div>
          <button type="button" onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <section className="form-section">
            <h3>
              <MessageSquare size={18} />
              Limites de Mensagens
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dailyLimit">Limite Diário *</label>
                <input
                  id="dailyLimit"
                  type="number"
                  min="1"
                  max="500"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(Number(e.target.value))}
                  required
                  disabled={loading}
                />
                <span className="input-hint">mensagens por dia</span>
              </div>

              <div className="form-group">
                <label htmlFor="weeklyLimit">Limite Semanal *</label>
                <input
                  id="weeklyLimit"
                  type="number"
                  min="1"
                  max="3500"
                  value={weeklyLimit}
                  onChange={(e) => setWeeklyLimit(Number(e.target.value))}
                  required
                  disabled={loading}
                />
                <span className="input-hint">mensagens por semana</span>
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3>Tipos de Mensagem Permitidos *</h3>
            <div className="message-types-grid">
              {(["text", "audio", "image", "video"] as const).map((type) => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={messageTypes.includes(type)}
                    onChange={() => handleMessageTypeToggle(type)}
                    disabled={loading}
                  />
                  <span className="checkbox-custom">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="form-section">
            <h3>
              <Target size={18} />
              Requisitos de Interação
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="responseRate">Taxa de Resposta (%)</label>
                <input
                  id="responseRate"
                  type="number"
                  min="0"
                  max="100"
                  value={responseRate}
                  onChange={(e) => setResponseRate(Number(e.target.value))}
                  disabled={loading}
                />
                <span className="input-hint">mínimo esperado</span>
              </div>

              <div className="form-group">
                <label htmlFor="groupJoins">Entradas em Grupos</label>
                <input
                  id="groupJoins"
                  type="number"
                  min="0"
                  value={groupJoins}
                  onChange={(e) => setGroupJoins(Number(e.target.value))}
                  disabled={loading}
                />
                <span className="input-hint">quantidade desejada</span>
              </div>

              <div className="form-group">
                <label htmlFor="manualInteractions">Interações Manuais</label>
                <input
                  id="manualInteractions"
                  type="number"
                  min="0"
                  value={manualInteractions}
                  onChange={(e) =>
                    setManualInteractions(Number(e.target.value))
                  }
                  disabled={loading}
                />
                <span className="input-hint">por período</span>
              </div>
            </div>
          </section>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading
                ? "Salvando..."
                : existingPlan
                ? "Atualizar Plano"
                : "Criar Plano"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
