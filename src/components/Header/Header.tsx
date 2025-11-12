import { Menu, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import logo from "../../assets/logo.jpg";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./Header.css";

type HeaderAction = {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
};

type HeaderProps = {
  onToggleSidebar: () => void;
  actions?: HeaderAction[];
};

export function Header({ onToggleSidebar, actions = [] }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userName = user?.name || "Operador";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };
  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          type="button"
          aria-label="TAlternar menu lateral"
        >
          <Menu size={22} />
        </button>

        <div className="header-brand">
          <div className="brand-logo">
            <img src={logo} alt="EcoCorp" />
          </div>

          <div className="brand-info">
            <strong>Painel EcoCorp</strong>
            <span>Monitoramento e aquecimento inteligente de números</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="header-action"
            onClick={action.onClick}
            title={action.label}
          >
            {action.icon}
          </button>
        ))}

        <div className="header-divider" />

        <div className="header-user">
          <div className="user-acatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <span>{userName}</span>
          </div>
          <button
            type="button"
            className="logout-button"
            title="Sair"
            onClick={handleLogout}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
