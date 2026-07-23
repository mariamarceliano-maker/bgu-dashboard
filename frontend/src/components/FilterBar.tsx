import type { FilterOptions } from "../types";
import "./FilterBar.css";

export interface KpiFilters {
  dashboard: string;
  dimension: string;
  objetivo: string;
  estado: string;
  codigo: string;
  nombre: string;
}

interface Props {
  options: FilterOptions | null;
  value: KpiFilters;
  onChange: (next: KpiFilters) => void;
  onReset: () => void;
}

export default function FilterBar({ options, value, onChange, onReset }: Props) {
  const set = (key: keyof KpiFilters) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    onChange({ ...value, [key]: e.target.value });

  return (
    <div className="filter-bar">
      <div className="filter-bar__field">
        <label>Dashboard</label>
        <select value={value.dashboard} onChange={set("dashboard")}>
          <option value="">Todos</option>
          {options?.dashboards.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-bar__field">
        <label>Dimensión</label>
        <select value={value.dimension} onChange={set("dimension")}>
          <option value="">Todas</option>
          {options?.dimensiones.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-bar__field">
        <label>Objetivo</label>
        <select value={value.objetivo} onChange={set("objetivo")}>
          <option value="">Todos</option>
          {options?.objetivos
            .filter((o) => /^Objetivo \d/.test(o))
            .map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
        </select>
      </div>

      <div className="filter-bar__field">
        <label>Estado</label>
        <select value={value.estado} onChange={set("estado")}>
          <option value="">Todos</option>
          {options?.estados.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-bar__field">
        <label>Código KPI</label>
        <input type="text" placeholder="Ej. E3-K3" value={value.codigo} onChange={set("codigo")} />
      </div>

      <div className="filter-bar__field">
        <label>Nombre KPI</label>
        <input type="text" placeholder="Buscar por nombre…" value={value.nombre} onChange={set("nombre")} />
      </div>

      <button type="button" className="filter-bar__reset" onClick={onReset}>
        Limpiar filtros
      </button>
    </div>
  );
}
