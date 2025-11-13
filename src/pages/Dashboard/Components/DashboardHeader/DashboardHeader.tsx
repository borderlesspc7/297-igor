import { Plus, Building2, User } from "lucide-react";
import { useAuth } from "../../../../hooks/useAuth";
import "./DashboardHeader.css";

interface DashboardHeaderProps {
  onAddNumber: () => void;
}

export function DashboardHeader({ onAddNumber }: DashboardHeaderProps) {
  const { user } = useAuth();
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-info">
        <div className="dashboard-user">
          <User size={20} />
          <span>{user?.name}</span>
        </div>
        <div className="dashboard-company">
          <Building2 size={20} />
          <span>EcoCorp</span>
        </div>
      </div>
      <button type="button" className="btn-add-number" onClick={onAddNumber}>
        <Plus size={20} />
        <span>Adicionar número</span>
      </button>
    </header>
  );
}
