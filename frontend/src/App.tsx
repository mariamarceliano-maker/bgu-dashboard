import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";

const HomePage = lazy(() => import("./pages/HomePage"));
const PlanPage = lazy(() => import("./pages/PlanPage"));
const EvaluacionPage = lazy(() => import("./pages/EvaluacionPage"));
const MatchPage = lazy(() => import("./pages/MatchPage"));
const KpiListPage = lazy(() => import("./pages/KpiListPage"));
const OpportunitiesPage = lazy(() => import("./pages/OpportunitiesPage"));

function PageFallback() {
  return <p style={{ color: "var(--bgu-text-muted)", padding: "20px 4px" }}>Cargando…</p>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/estrategico"
              element={
                <PlanPage
                  dashboardKey="estrategico"
                  title="Plan Estratégico"
                  description="Indicadores clave (E1-K1 … E7-K4) del Plan Estratégico 2023-2028, agrupados por dimensión institucional."
                />
              }
            />
            <Route
              path="/efectividad"
              element={
                <PlanPage
                  dashboardKey="efectividad"
                  title="Plan de Efectividad"
                  description="Indicadores institucionales, estratégicos y operativos del Plan de Efectividad 2025-2026, agrupados por dimensión (estrategia)."
                />
              }
            />
            <Route path="/evaluacion" element={<EvaluacionPage />} />
            <Route path="/match" element={<MatchPage />} />
            <Route path="/kpis" element={<KpiListPage />} />
            <Route path="/oportunidades" element={<OpportunitiesPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
