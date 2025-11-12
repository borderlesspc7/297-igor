import {
  Gauge,
  MessageSquare,
  PhoneCall,
  Users,
  Thermometer,
  FileText,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export type SidebarLink = {
  label: string;
  to: string;
  icon: React.ComponentType<{ size?: number }>;
};

type SidebarProps = {
  links?: SidebarLink[];
  isOpen?: boolean;
  collapsed?: boolean;
  onClose?: () => void;
};

const defaultLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    to: "/menu",
    icon: Gauge,
  },
  {
    label: "Gestão de números",
    to: "/numeros",
    icon: PhoneCall,
  },
  {
    label: "Gestão de usuários",
    to: "/usuarios",
    icon: Users,
  },
  {
    label: "Plano de aquecimento",
    to: "/plano-aquecimento",
    icon: Thermometer,
  },
  {
    label: "Interações",
    to: "/interacoes",
    icon: MessageSquare,
  },
  {
    label: "Grupos",
    to: "/grupos",
    icon: Users,
  },
  {
    label: "Relatórios",
    to: "/relatorios",
    icon: FileText,
  },
];

export function Sidebar({
  links = defaultLinks,
  isOpen = true,
  collapsed = false,
  onClose,
}: SidebarProps) {
  return (
    <aside
      className={[
        "app-sidebar",
        isOpen ? "open" : "closed",
        collapsed ? "collapsed" : "",
      ].join(" ")}
    >
      <div className="sidebar-header">
        <span>EcoCorp</span>
        <button
          type="button"
          className="sidebar-close"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>
          Plano: <strong>Growth</strong>
        </p>
        <small>Monitoramento em tempo real</small>
      </div>
    </aside>
  );
}
