export type Estado =
  | "Cumplido"
  | "Parcialmente cumplido"
  | "No cumplido"
  | "Sin datos"
  | "No aplicable / Cohorte no madura";

export const ESTADOS_ORDEN: Estado[] = [
  "Cumplido",
  "Parcialmente cumplido",
  "No cumplido",
  "Sin datos",
  "No aplicable / Cohorte no madura",
];

// Paleta institucional (azul/dorado BGU) + semáforo de estado
export const ESTADO_COLOR: Record<Estado, string> = {
  Cumplido: "#1E8F5F",
  "Parcialmente cumplido": "#F2A93B",
  "No cumplido": "#D64545",
  "Sin datos": "#9AA5B1",
  "No aplicable / Cohorte no madura": "#5B6B8C",
};

export interface KPI {
  dashboard: string;
  codigo: string;
  nombre: string;
  dimension: string;
  objetivo: string;
  objetivo_num: number | null;
  tipo: string;
  formula: string;
  meta: string;
  resultado: string;
  evidencia: string;
  responsable: string;
  estado: Estado;
  estado_original: string;
  codigo_relacionado_efectividad: string;
  codigo_relacionado_estrategico: string;
  oportunidad_mejora: boolean;
  oportunidad_mensaje: string;
}

export interface SummaryResponse {
  dashboard: string;
  counts: Record<Estado, number>;
  total: number;
}

export interface ChartGroupRow {
  grupo: string;
  total: number;
  [estado: string]: string | number;
}

export interface ChartResponse {
  dashboard: string;
  agrupado_por: string;
  data: ChartGroupRow[];
}

export interface MatchRow {
  assessment_codigo: string;
  assessment_nombre: string;
  effectiveness_codigo: string;
  effectiveness_nombre: string;
  strategic_codigo: string;
  strategic_nombre: string;
}

export interface Opportunity {
  dashboard: string;
  codigo: string;
  nombre: string;
  estado_actual: Estado;
  mensaje: string;
}

export interface FilterOptions {
  dashboards: string[];
  dimensiones: string[];
  objetivos: string[];
  estados: string[];
}

export type DashboardKey = "estrategico" | "efectividad" | "evaluacion";

export const DASHBOARD_LABELS: Record<DashboardKey, string> = {
  estrategico: "Plan Estratégico",
  efectividad: "Plan de Efectividad",
  evaluacion: "Plan de Evaluación de Resultados",
};
