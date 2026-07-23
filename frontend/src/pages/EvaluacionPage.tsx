import { api } from "../api/client";
import SummaryCard from "../components/SummaryCard";
import StackedStatusChart from "../components/StackedStatusChart";
import { useFetch } from "../utils/useFetch";
import "./PlanPage.css";

export default function EvaluacionPage() {
  const { data: summary, loading: loadingSummary } = useFetch(
    () => api.summary("evaluacion"),
    []
  );
  const { data: chart, loading: loadingChart } = useFetch(
    () => api.chart("evaluacion"),
    []
  );

  return (
    <div className="plan-page">
      <header className="plan-page__intro">
        <h2>Plan de Evaluación de Resultados</h2>
        <p>
          Indicadores directos (D-01 a D-09) e indirectos (I-01 a I-11) de evaluación
          institucional (assessment). Se agrupan por <strong>Objetivo institucional</strong>{" "}
          según la columna "Alineación de IO" de la hoja de registro. Cuando un indicador
          se alinea a más de un objetivo, se contabiliza en el primero listado.
        </p>
      </header>

      <div className="plan-page__summary">
        <SummaryCard title="Resumen por estado" data={summary} loading={loadingSummary} />
      </div>

      <div className="plan-page__chart">
        {loadingChart ? (
          <div className="chart-card">
            <h3>Distribución por objetivo</h3>
            <p className="chart-card__empty">Cargando gráfico…</p>
          </div>
        ) : (
          <StackedStatusChart
            title="Distribución de estados por objetivo institucional"
            subtitle="Barras apiladas"
            data={chart?.data ?? []}
            xAxisTitle="Objetivo"
          />
        )}
      </div>
    </div>
  );
}
