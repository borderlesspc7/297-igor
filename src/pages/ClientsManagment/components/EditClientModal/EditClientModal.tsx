import { useState, useEffect, type FormEvent } from "react";
import { X, User, Building2, Mail, Phone, FileText } from "lucide-react";
import type {
  ClientDetails,
  UpdateClientInput,
  ClientStatus,
} from "../../../../types/client";
import { clientService } from "../../../../services/clientService";
import "./EditClientModal.css";

type EditClientModalProps = {
  client: ClientDetails;
  onClose: () => void;
  onUpdate: () => void;
};

export function EditClientModal({
  client,
  onClose,
  onUpdate,
}: EditClientModalProps) {
  const [formData, setFormData] = useState<UpdateClientInput>({
    name: client.name,
    email: client.email,
    phone: client.phone || "",
    company: client.company,
    document: client.document || "",
    status: client.status,
    plan: client.plan || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || "",
      company: client.company,
      document: client.document || "",
      status: client.status,
      plan: client.plan || "",
    });
  }, [client]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.company) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      await clientService.update(client.id, formData);
      onUpdate();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar cliente"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Editar Cliente</h2>
          <button type="button" className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">
              <User size={18} />
              Nome do Responsável *
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nome completo"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">
              <Building2 size={18} />
              Empresa *
            </label>
            <input
              id="company"
              type="text"
              placeholder="Nome da empresa"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} />
              E-mail *
            </label>
            <input
              id="email"
              type="email"
              placeholder="contato@empresa.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">
                <Phone size={18} />
                Telefone
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="document">
                <FileText size={18} />
                CPF/CNPJ
              </label>
              <input
                id="document"
                type="text"
                placeholder="00.000.000/0000-00"
                value={formData.document || ""}
                onChange={(e) =>
                  setFormData({ ...formData, document: e.target.value })
                }
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as ClientStatus,
                  })
                }
                required
                disabled={loading}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="suspenso">Suspenso</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="plan">Plano Contratado</label>
              <select
                id="plan"
                value={formData.plan || ""}
                onChange={(e) =>
                  setFormData({ ...formData, plan: e.target.value })
                }
                disabled={loading}
              >
                <option value="">Selecione um plano</option>
                <option value="starter">Starter</option>
                <option value="growth">Growth</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
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
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
