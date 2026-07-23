import Plot from "react-plotly.js";
import { ESTADOS_ORDEN, ESTADO_COLOR, type ChartGroupRow } from "../types";
import "./StackedStatusChart.css";

interface Props {
  title: string;
  subtitle?: string;
  data: ChartGroupRow[];
  xAxisTitle?: string;
}

export default function StackedStatusChart({ title, subtitle, data, xAxisTitle }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h3>{title}</h3>
        <p className="chart-card__empty">Sin datos disponibles para graficar.</p>
      </div>
    );
  }

  const categorias = data.map((d) => d.grupo);

  const traces = ESTADOS_ORDEN.map((estado) => ({
    x: categorias,
    y: data.map((d) => Number(d[estado] ?? 0)),
    name: estado,
    type: "bar" as const,
    marker: { color: ESTADO_COLOR[estado] },
    hovertemplate: "%{x}<br>" + estado + ": %{y}<extra></extra>",
  }));

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3>{title}</h3>
        {subtitle && <span className="chart-card__subtitle">{subtitle}</span>}
      </div>
      <Plot
        data={traces}
        layout={{
          barmode: "stack",
          autosize: true,
          height: 380,
          margin: { l: 44, r: 16, t: 8, b: 90 },
          legend: {
            orientation: "h",
            y: -0.35,
            font: { family: "Inter, sans-serif", size: 11 },
          },
          xaxis: {
            title: xAxisTitle ? { text: xAxisTitle } : undefined,
            tickfont: { family: "Inter, sans-serif", size: 11 },
            automargin: true,
          },
          yaxis: {
            title: { text: "N° de KPI" },
            tickfont: { family: "Inter, sans-serif", size: 11 },
            gridcolor: "#e2e7f0",
          },
          font: { family: "Inter, sans-serif", color: "#16223f" },
          plot_bgcolor: "rgba(0,0,0,0)",
          paper_bgcolor: "rgba(0,0,0,0)",
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: "100%" }}
        useResizeHandler
      />
    </div>
  );
}
