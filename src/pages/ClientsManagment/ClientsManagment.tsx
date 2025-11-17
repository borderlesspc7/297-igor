import { useState, useEffect } from "react";
import { Layout } from "../../components/Layout/Layout";
import { ClientList } from "./components/ClientList/ClientList";
import { CreateClientModal } from "./components/CreateClientModal/CreateClientModal";
import { EditClientModal } from "./components/EditClientModal/EditClientModal";
import { ClientDetails } from "./components/ClientDetails/ClientDetails";
import { clientService } from "../../services/clientService";
import type {
  Client,
  ClientDetails as ClientDetailsType,
  CreateClientInput,
  ClientStatus,
} from "../../types/client";
import "./ClientsManagment.css";

export default function ClientsManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientDetailsType | null>(
    null
  );
  const [selectedClient, setSelectedClient] =
    useState<ClientDetailsType | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await clientService.list();
      setClients(data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (input: CreateClientInput) => {
    try {
      const newClient = await clientService.create(input);
      setClients([...clients, newClient]);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw error;
    }
  };

  const handleViewDetails = async (id: string) => {
    const details = await clientService.getById(id);
    if (details) setSelectedClient(details);
  };

  const handleEditClient = async (id: string) => {
    const details = await clientService.getById(id);
    if (details) setEditingClient(details);
  };

  const handleDeleteClient = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este cliente?")) {
      return;
    }

    try {
      await clientService.delete(id);
      await loadClients();
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      alert("Erro ao deletar cliente. Tente novamente.");
    }
  };

  const handleUpdateStatus = async (id: string, status: ClientStatus) => {
    try {
      await clientService.updateStatus(id, status);
      await loadClients();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      throw error;
    }
  };

  const filteredClients =
    filterStatus === "all"
      ? clients
      : clients.filter((c) => c.status === filterStatus);

  const searchedClients = searchTerm
    ? filteredClients.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredClients;

  return (
    <Layout>
      <div className="clients-management">
        <header className="clients-management-header">
          <div>
            <h1>Gestão de Clientes</h1>
            <p>Gerencie empresas e organizações que utilizam a plataforma</p>
          </div>
          <button
            type="button"
            className="btn-create-client"
            onClick={() => setShowCreateModal(true)}
          >
            <span>+</span>
            Cadastrar Cliente
          </button>
        </header>

        <div className="clients-management-controls">
          <div className="clients-search">
            <input
              type="text"
              placeholder="Buscar por nome, empresa ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="clients-management-filters">
            <button
              type="button"
              className={filterStatus === "all" ? "active" : ""}
              onClick={() => setFilterStatus("all")}
            >
              Todos
            </button>
            <button
              type="button"
              className={filterStatus === "ativo" ? "active" : ""}
              onClick={() => setFilterStatus("ativo")}
            >
              Ativos
            </button>
            <button
              type="button"
              className={filterStatus === "inativo" ? "active" : ""}
              onClick={() => setFilterStatus("inativo")}
            >
              Inativos
            </button>
            <button
              type="button"
              className={filterStatus === "suspenso" ? "active" : ""}
              onClick={() => setFilterStatus("suspenso")}
            >
              Suspensos
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Carregando clientes...</div>
        ) : (
          <ClientList
            clients={searchedClients}
            selectedClients={selectedClients}
            onSelectionChange={setSelectedClients}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
          />
        )}

        {showCreateModal && (
          <CreateClientModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateClient}
          />
        )}

        {selectedClient && (
          <ClientDetails
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
            onUpdate={loadClients}
          />
        )}

        {editingClient && (
          <EditClientModal
            client={editingClient}
            onClose={() => setEditingClient(null)}
            onUpdate={async () => {
              await loadClients();
              setEditingClient(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
}
