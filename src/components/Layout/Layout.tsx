import { type ReactNode, useState } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import "./Layout.css";
import { Bell } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCollapseSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={handleToggleSidebar}
      />

      <div className="app-content">
        <Header
          onToggleSidebar={handleToggleSidebar}
          actions={[
            { label: "Notificações", icon: <Bell size={18} /> },
            {
              label: sidebarCollapsed ? "Expandir menu" : "Recolher menu",
              icon: (
                <button
                  type="button"
                  onClick={handleCollapseSidebar}
                  className="ghost-button"
                >
                  {sidebarCollapsed ? "Expandir" : "Recolher"}
                </button>
              ),
            },
          ]}
        />

        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}
