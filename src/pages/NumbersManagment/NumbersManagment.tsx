import { useState, useEffect } from "react";
import { Layout } from "../../components/Layout/Layout";
import { NumberList } from "./components/NumberList/NumberList";
import { CreateNumberModal } from "./components/CreateNumberModal/CreateNumberModal";
import { NumberDetails } from "./components/NumberDetails/NumberDetails";
import { InteractionModal } from "./components/InteractionModal/InteractionModal";
import { HeatingPlanModal } from "./components/HeatingPlanModal/HeatingPlanModal";
import { numberService } from "../../services/numberService";
import type {
  PhoneNumber,
  NumberDetails as NumberDetailsType,
  CreateNumberInput,
  NumberStatus,
  InteractionType,
} from "../../types/number";
import "./NumbersManagment.css";

export default function NumbersManagment() {
  const [numbers, setNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNumber, setSelectedNumber] =
    useState<NumberDetailsType | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showInteractionModal, setShowInteractionModal] = useState<{
    numberId: string;
    numberName: string;
  } | null>(null);
  const [showHeatingPlanModal, setShowHeatingPlanModal] = useState<{
    numberId: string;
    numberName: string;
  } | null>(null);

  useEffect(() => {
    loadNumbers();
  }, []);

  const loadNumbers = async () => {
    setLoading(true);
    try {
      const data = await numberService.list();
      setNumbers(data);
    } catch (error) {
      console.error("Erro ao carregar números:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNumber = async (input: CreateNumberInput) => {
    try {
      const newNumber = await numberService.create(input);
      setNumbers([...numbers, newNumber]);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Erro ao criar número:", error);
      throw error;
    }
  };

  const handleViewDetails = async (id: string) => {
    const details = await numberService.getById(id);
    if (details) setSelectedNumber(details);
  };

  const handleUpdateStatus = async (id: string, status: NumberStatus) => {
    try {
      await numberService.updateStatus(id, status);
      await loadNumbers();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      throw error;
    }
  };

  const handleRegisterInteraction = (id: string) => {
    const number = numbers.find((n) => n.id === id);
    if (number) {
      setShowInteractionModal({
        numberId: id,
        numberName: number.displayName,
      });
    }
  };

  const handleConfigurePlan = (id: string) => {
    const number = numbers.find((n) => n.id === id);
    if (number) {
      setShowHeatingPlanModal({
        numberId: id,
        numberName: number.displayName,
      });
    }
  };

  const handleSubmitInteraction = async (
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
    await loadNumbers();
    setShowInteractionModal(null);
  };

  const handleSubmitHeatingPlan = async (
    numberId: string,
    plan: {
      dailyMessageLimit: number;
      weeklyMessageLimit: number;
      messageTypes: ("text" | "audio" | "image" | "video")[];
      interactionRequirements: {
        responseRate?: number;
        groupJoins?: number;
        manualInteractions?: number;
      };
    }
  ) => {
    await numberService.setHeatingPlan(numberId, plan);
    await loadNumbers();
    setShowHeatingPlanModal(null);
  };

  const filteredNumbers =
    filterStatus === "all"
      ? numbers
      : numbers.filter((n) => n.status === filterStatus);

  return (
    <Layout>
      <div className="numbers-management">
        <header className="numbers-management-header">
          <div>
            <h1>Gestão de Números</h1>
            <p>Gerencie, audite e monitore o histórico de cada número</p>
          </div>
          <button
            type="button"
            className="btn-create-number"
            onClick={() => setShowCreateModal(true)}
          >
            <span>+</span>
            Criar Número
          </button>
        </header>

        <div className="numbers-management-filters">
          <button
            type="button"
            className={filterStatus === "all" ? "active" : ""}
            onClick={() => setFilterStatus("all")}
          >
            Todos
          </button>
          <button
            type="button"
            className={filterStatus === "aquecendo" ? "active" : ""}
            onClick={() => setFilterStatus("aquecendo")}
          >
            Aquecendo
          </button>
          <button
            type="button"
            className={filterStatus === "pausado" ? "active" : ""}
            onClick={() => setFilterStatus("pausado")}
          >
            Pausados
          </button>
          <button
            type="button"
            className={filterStatus === "pronto" ? "active" : ""}
            onClick={() => setFilterStatus("pronto")}
          >
            Prontos
          </button>
          <button
            type="button"
            className={filterStatus === "banido" ? "active" : ""}
            onClick={() => setFilterStatus("banido")}
          >
            Banidos
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Carregando números...</div>
        ) : (
          <NumberList
            numbers={filteredNumbers}
            selectedNumbers={selectedNumbers}
            onSelectionChange={setSelectedNumbers}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
            onRegisterInteraction={handleRegisterInteraction}
            onConfigurePlan={handleConfigurePlan}
          />
        )}
        {showCreateModal && (
          <CreateNumberModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateNumber}
          />
        )}
        {selectedNumber && (
          <NumberDetails
            number={selectedNumber}
            onClose={() => setSelectedNumber(null)}
            onUpdate={loadNumbers}
          />
        )}

        {showInteractionModal && (
          <InteractionModal
            numberId={showInteractionModal.numberId}
            numberName={showInteractionModal.numberName}
            onClose={() => setShowInteractionModal(null)}
            onSubmit={handleSubmitInteraction}
          />
        )}

        {showHeatingPlanModal && (
          <HeatingPlanModal
            numberId={showHeatingPlanModal.numberId}
            numberName={showHeatingPlanModal.numberName}
            onClose={() => setShowHeatingPlanModal(null)}
            onSubmit={async (plan) => {
              await handleSubmitHeatingPlan(
                showHeatingPlanModal.numberId,
                plan
              );
            }}
          />
        )}
      </div>
    </Layout>
  );
}
