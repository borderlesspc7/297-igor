import { useState, type FormEvent } from "react";
import { X, MessageSquare } from "lucide-react";
import type { InteractionType } from "../../../../types/number";
import "./InteractionModal.css";

type InteractionModalProps = {
  numberId: string;
  numberName: string;
  onClose: () => void;
  onSubmit: (
    numberId: string,
    interaction: {
      type: InteractionType;
      description: string;
      metadata?: Record<string, unknown>;
    }
  ) => Promise<void>;
};

const interactionTypes: { value: InteractionType; label: string }[] = [
  { value: "manual_interaction", label: "Interação Manual" },
  { value: "message_sent", label: "Mensagem Enviada" },
  { value: "message_received", label: "Mensagem Recebida" },
  { value: "group_joined", label: "Entrada em Grupo" },
  { value: "profile_update", label: "Atualização de Perfil" },
  { value: "block_alert", label: "Alerta de Bloqueio" },
];

export function InteractionModal({
  numberId,
  numberName,
  onClose,
  onSubmit,
}: InteractionModalProps) {
  const [type, setType] = useState<InteractionType>("manual_interaction");
  const [description, setDescription] = useState("");
  const [metadata] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Descreva a interação");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(numberId, { type, description, metadata });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao registrar interação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div>
            <h2>Registrar Interação Manual</h2>
            <p>{numberName}</p>
          </div>
          <button type="button" className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="type">Tipo de Interação *</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as InteractionType)}
              required
              disabled={loading}
            >
              {interactionTypes.map((it) => (
                <option key={it.value} value={it.value}>
                  {it.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              <MessageSquare size={18} />
              Descrição da Interação *
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Descreva detalhadamente a interação realizada..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrar Interação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
