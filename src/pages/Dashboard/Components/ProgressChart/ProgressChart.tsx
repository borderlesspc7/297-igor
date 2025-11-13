import { TrendingUp } from "lucide-react";
import "./ProgressChart.css";

export function ProgressChart() {
  const weekData = [
    { day: "Seg", messages: 120, interactions: 85 },
    { day: "Ter", messages: 180, interactions: 142 },
    { day: "Qua", messages: 250, interactions: 198 },
    { day: "Qui", messages: 320, interactions: 265 },
    { day: "Sex", messages: 410, interactions: 348 },
    { day: "Sáb", messages: 380, interactions: 298 },
    { day: "Dom", messages: 290, interactions: 215 },
  ];

  const maxValue = Math.max(...weekData.map((item) => item.messages));

  return (
    <div className="progress-chart-container">
      <div className="progress-chart-header">
        <div>
          <h3>Progresso de aquecimento</h3>
          <p>Evolução semanal de mensagens e interações</p>
        </div>

        <div className="progress-chart-badge">
          <TrendingUp size={16} />
          <span>+28% esta semana</span>
        </div>
      </div>

      <div className="progress-chart">
        {weekData.map((item, index) => (
          <div className="chart-bar-group" key={index}>
            <div className="chart-bars">
              <div
                className="chart-bar messages"
                style={{
                  height: `${(item.messages / maxValue) * 100}%`,
                }}
                title={`${item.messages} mensagens`}
              />
              <div
                className="chart-bar interactions"
                style={{
                  height: `${(item.interactions / maxValue) * 100}%`,
                }}
                title={`${item.interactions} interações`}
              />
            </div>
            <span className="chart-label">{item.day}</span>
          </div>
        ))}
      </div>

      <div className="progress-chart-legend">
        <div className="legend-item">
          <span className="legend-dot-messages"></span>
          <span>Mensagens Enviadas</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot-interactions"></span>
          <span>Interações Reais</span>
        </div>
      </div>
    </div>
  );
}
