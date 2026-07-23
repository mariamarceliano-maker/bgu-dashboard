import { api } from "../api/client";
import SummaryCard from "../components/SummaryCard";
import StackedStatusChart from "../components/StackedStatusChart";
import { useFetch } from "../utils/useFetch";
import type { DashboardKey } from "../types";
import "./PlanPage.css";

interface Props {
  dashboardKey: DashboardKey;
  title: string;
  description: string;
}

export default function PlanPage({ dashboardKey, title, description }: Props) {
  const { data: summary, loading: loadingSummary } = useFetch(
    () => api.summary(dashboardKey),
    [dashboardKey]
  );
  const { data: chart, loading: loadingChart } = useFetch(
    () => api.chart(dashboardKey),
    [dashboardKey]
  );

  return (
    <div className="plan-page">
      <header className="plan-page__intro">
        <h2>{title}</h2>
        <p>{description}</p>
      </header>

      <div className="plan-page__summary">
        <SummaryCard title="Resumen por estado" data={summary} loading={loadingSummary} />
      </div>

      <div className="plan-page__chart">
        {loadingChart ? (
          <div className="chart-card">
            <h3>Distribución por dimensión</h3>
            <p className="chart-card__empty">Cargando gráfico…</p>
          </div>
        ) : (
          <StackedStatusChart
            title="Distribución de estados por dimensión"
            subtitle="Barras apiladas"
            data={chart?.data ?? []}
            xAxisTitle="Dimensión"
          />
        )}
      </div>
    </div>
  );
}
