import { useState, type FormEvent } from "react";
import { X, Phone, Building2, User, Wifi } from "lucide-react";
import type { CreateNumberInput } from "../../../../types/number";
import "./CreateNumberModal.css";

type CreateNumberModalProps = {
  onClose: () => void;
  onSubmit: (input: CreateNumberInput) => Promise<void>;
};

export function CreateNumberModal({
  onClose,
  onSubmit,
}: CreateNumberModalProps) {
  const [formData, setFormData] = useState<CreateNumberInput>({
    number: "",
    displayName: "",
    company: "",
    operator: "",
    profilePhoto: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (
      !formData.number ||
      !formData.displayName ||
      !formData.company
    ) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Erro ao criar número:", error);
      setError("Erro ao criar número. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Criar Novo Número</h2>
          <button type="button" className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="number">
              <Phone size={18} />
              Número do WhatsApp *
            </label>
            <input
              id="number"
              type="tel"
              placeholder="+55 11 98765-4321"
              value={formData.number}
              onChange={(e) =>
                setFormData({ ...formData, number: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="displayName">
              <User size={18} />
              Nome de Exibição *
            </label>
            <input
              id="displayName"
              type="text"
              placeholder="Atendimento SP 01"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">
              <Building2 size={18} />
              Empresa Contratante *
            </label>
            <input
              id="company"
              type="text"
              placeholder="EcoCorp São Paulo"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="operator">
              <Wifi size={18} />
              Operadora
            </label>
            <input
              id="operator"
              type="text"
              placeholder="Vivo, TIM, Claro, etc."
              value={formData.operator}
              onChange={(e) =>
                setFormData({ ...formData, operator: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="profilePhoto">URL da Foto de Perfil</label>
            <input
              id="profilePhoto"
              type="url"
              placeholder="https://..."
              value={formData.profilePhoto || ""}
              onChange={(e) =>
                setFormData({ ...formData, profilePhoto: e.target.value })
              }
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
              {loading ? "Criando..." : "Criar Número"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
