import { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
} from "ag-grid-community";
import { api } from "../api/client";
import { useFetch } from "../utils/useFetch";
import FilterBar, { type KpiFilters } from "../components/FilterBar";
import { exportKpisToExcel, exportKpisToPdf } from "../utils/exporters";
import { ESTADO_COLOR, type KPI } from "../types";
import "./KpiListPage.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const bguGridTheme = themeQuartz.withParams({
  accentColor: "#c69b3f",
  headerBackgroundColor: "#0f2a54",
  headerTextColor: "#ffffff",
  headerFontWeight: 600,
  fontFamily: "Inter, sans-serif",
  fontSize: 13,
  oddRowBackgroundColor: "#f8f9fc",
  borderColor: "#e2e7f0",
  wrapperBorderRadius: 14,
});

const EMPTY_FILTERS: KpiFilters = {
  dashboard: "",
  dimension: "",
  objetivo: "",
  estado: "",
  codigo: "",
  nombre: "",
};

function EstadoBadge({ estado }: { estado: KPI["estado"] }) {
  return (
    <span className="estado-badge" style={{ backgroundColor: `${ESTADO_COLOR[estado]}1a`, color: ESTADO_COLOR[estado] }}>
      <span className="estado-badge__dot" style={{ backgroundColor: ESTADO_COLOR[estado] }} />
      {estado}
    </span>
  );
}

export default function KpiListPage() {
  const { data: kpisResp, loading } = useFetch(() => api.kpis(), []);
  const { data: filterOptions } = useFetch(() => api.filters(), []);
  const [filters, setFilters] = useState<KpiFilters>(EMPTY_FILTERS);

  const allKpis = kpisResp?.data ?? [];

  const filteredKpis = useMemo(() => {
    return allKpis.filter((k) => {
      if (filters.dashboard && k.dashboard !== filters.dashboard) return false;
      if (filters.dimension && k.dimension !== filters.dimension) return false;
      if (filters.objetivo && k.objetivo !== filters.objetivo) return false;
      if (filters.estado && k.estado !== filters.estado) return false;
      if (filters.codigo && !k.codigo.toLowerCase().includes(filters.codigo.toLowerCase())) return false;
      if (filters.nombre && !k.nombre.toLowerCase().includes(filters.nombre.toLowerCase())) return false;
      return true;
    });
  }, [allKpis, filters]);

  const columnDefs = useMemo<ColDef<KPI>[]>(
    () => [
      { field: "dashboard", headerName: "Dashboard", width: 200, filter: true },
      { field: "codigo", headerName: "Código", width: 120, cellClass: "mono", filter: true },
      { field: "nombre", headerName: "Nombre del KPI", flex: 2, minWidth: 260, filter: true, wrapText: true, autoHeight: true },
      { field: "dimension", headerName: "Dimensión", width: 190, filter: true },
      { field: "objetivo", headerName: "Objetivo", width: 160, filter: true },
      { field: "meta", headerName: "Meta", width: 110 },
      { field: "resultado", headerName: "Resultado", width: 120 },
      {
        field: "estado",
        headerName: "Estado",
        width: 190,
        filter: true,
        cellRenderer: (p: { value: KPI["estado"] }) => <EstadoBadge estado={p.value} />,
      },
      { field: "responsable", headerName: "Responsable", width: 150 },
    ],
    []
  );

  return (
    <div className="kpi-list-page">
      <header className="kpi-list-page__intro">
        <h2>Lista Completa de KPI</h2>
        <p>
          Los {allKpis.length} indicadores de los tres planes institucionales en una sola tabla.
          Use los filtros o los controles de columna de la tabla para buscar, ordenar y exportar.
        </p>
      </header>

      <FilterBar
        options={filterOptions ?? null}
        value={filters}
        onChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
      />

      <div className="kpi-list-page__toolbar">
        <span className="kpi-list-page__count">
          {filteredKpis.length} de {allKpis.length} indicadores
        </span>
        <div className="kpi-list-page__actions">
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => exportKpisToExcel(filteredKpis)}
          >
            ⬇ Exportar Excel
          </button>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => exportKpisToPdf(filteredKpis)}
          >
            ⬇ Exportar PDF
          </button>
        </div>
      </div>

      <div className="kpi-list-page__grid">
        {loading ? (
          <p className="kpi-list-page__loading">Cargando indicadores…</p>
        ) : (
          <AgGridReact<KPI>
            theme={bguGridTheme}
            rowData={filteredKpis}
            columnDefs={columnDefs}
            defaultColDef={{ sortable: true, resizable: true }}
            pagination
            paginationPageSize={20}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            domLayout="autoHeight"
            animateRows
          />
        )}
      </div>
    </div>
  );
}
