import { Building2, User } from "lucide-react";
import { useAuth } from "../../../../hooks/useAuth";
import "./DashboardHeader.css";

export function DashboardHeader() {
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
    </header>
  );
}
