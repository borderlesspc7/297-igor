import {
  Phone,
  TrendingUp,
  CheckCircle2,
  MessageSquare,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import "./SummaryCards.css";

interface SummaryCardsProps {
  totalNumbers: number;
  heatingNumbers: number;
  readyNumbers: number;
  messagesSentToday: number;
  responseRate: number;
  criticalAlerts: number;
}

export function SummaryCards({
  totalNumbers,
  heatingNumbers,
  readyNumbers,
  messagesSentToday,
  responseRate,
  criticalAlerts,
}: SummaryCardsProps) {
  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="summary-card-icon total">
          <Phone size={22} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">Total de números</span>
          <strong className="summary-card-value">{totalNumbers}</strong>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-icon heating">
          <TrendingUp size={22} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">Em aquecimento</span>
          <strong className="summary-card-value">{heatingNumbers}</strong>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-icon ready">
          <CheckCircle2 size={22} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">Prontos</span>
          <strong className="summary-card-value">{readyNumbers}</strong>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-icon messages">
          <MessageSquare size={22} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">Mensagens hoje</span>
          <strong className="summary-card-value">
            {messagesSentToday.toLocaleString()}
          </strong>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-icon rate">
          <BarChart3 size={22} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">Taxa de resposta</span>
          <strong className="summary-card-value">
            {responseRate.toFixed(1)}%
          </strong>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-icon alert">
          <AlertTriangle size={22} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">Alertas críticos</span>
          <strong className="summary-card-value">{criticalAlerts}</strong>
        </div>
      </div>
    </div>
  );
}
