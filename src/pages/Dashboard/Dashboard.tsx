import { Layout } from "../../components/Layout/Layout";
import { DashboardHeader } from "./Components/DashboardHeader/DashboardHeader";
import { SummaryCards } from "./Components/SummaryCards/SummaryCards";
import { ProgressChart } from "./Components/ProgressChart/ProgressChart";
import { NumbersGrid } from "./Components/NumbersGrid/NumbersGrid";
import { ActivityFeed } from "./Components/ActivityFeed/ActivityFeed";
import "./Dashboard.css";

export default function DashboardPage() {
  return (
    <Layout>
      <div className="dashboard-container">
        <DashboardHeader onAddNumber={() => console.log("Adicionar número")} />

        <SummaryCards
          totalNumbers={45}
          heatingNumbers={12}
          readyNumbers={28}
          messagesSentToday={1847}
          responseRate={68.5}
          criticalAlerts={3}
        />

        <div className="dashboard-grid">
          <div className="dashboard-main">
            <ProgressChart />
            <NumbersGrid />
          </div>

          <div className="dashboard-sidebar">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </Layout>
  );
}
