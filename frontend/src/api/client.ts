import type {
  ChartResponse,
  DashboardKey,
  FilterOptions,
  KPI,
  MatchRow,
  Opportunity,
  SummaryResponse,
} from "../types";

// La URL del backend se configura vía variable de entorno de Vite.
// En desarrollo local por defecto apunta a http://localhost:8000
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:8000";

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Error ${res.status} al consultar ${path}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  health: () => getJSON<{ status: string; loaded_at: string | null }>("/api/health"),

  summary: (dashboard: DashboardKey) =>
    getJSON<SummaryResponse>(`/api/summary/${dashboard}`),

  chart: (dashboard: DashboardKey) =>
    getJSON<ChartResponse>(`/api/chart/${dashboard}`),

  matchTable: () => getJSON<{ data: MatchRow[] }>("/api/match"),

  opportunities: () => getJSON<{ data: Opportunity[] }>("/api/opportunities"),

  filters: () => getJSON<FilterOptions>("/api/filters"),

  kpis: (params: Record<string, string | undefined> = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) qs.set(k, v);
    });
    const query = qs.toString();
    return getJSON<{ total: number; data: KPI[] }>(
      `/api/kpis${query ? `?${query}` : ""}`
    );
  },
};
