import { Link } from "react-router-dom";
import { api } from "../api/client";
import SummaryCard from "../components/SummaryCard";
import { useFetch } from "../utils/useFetch";
import "./HomePage.css";

export default function HomePage() {
  const { data: est, loading: l1 } = useFetch(() => api.summary("estrategico"), []);
  const { data: efe, loading: l2 } = useFetch(() => api.summary("efectividad"), []);
  const { data: eva, loading: l3 } = useFetch(() => api.summary("evaluacion"), []);
  const { data: opp } = useFetch(() => api.opportunities(), []);
  const { data: health } = useFetch(() => api.health(), []);

  const totalKpi = (est?.total ?? 0) + (efe?.total ?? 0) + (eva?.total ?? 0);

  return (
    <div className="home-page">
      <section className="home-hero">
        <div>
          <p className="home-hero__eyebrow">Panorama institucional · Ciclo 2025 – 2026</p>
          <h2 className="home-hero__title">
            {totalKpi} indicadores consolidados en 3 planes institucionales
          </h2>
          <p className="home-hero__desc">
            Este dashboard lee automáticamente los archivos Excel de Planeamiento, Efectividad
            y Evaluación de Resultados de Blackwell Global University y consolida su avance en
            un único panel ejecutivo.
          </p>
          {health && (
            <p className="home-hero__sync">
              Última lectura de los Excel: {new Date(health.loaded_at ?? "").toLocaleString("es-PE")}
            </p>
          )}
        </div>
        {opp && opp.data.length > 0 && (
          <Link to="/oportunidades" className="home-hero__opp">
            <strong>{opp.data.length}</strong>
            <span>oportunidades de mejora identificadas</span>
          </Link>
        )}
      </section>

      <section className="home-summaries">
        <Link to="/estrategico" className="home-summaries__link">
          <SummaryCard title="Plan Estratégico" data={est} loading={l1} />
        </Link>
        <Link to="/efectividad" className="home-summaries__link">
          <SummaryCard title="Plan de Efectividad" data={efe} loading={l2} />
        </Link>
        <Link to="/evaluacion" className="home-summaries__link">
          <SummaryCard title="Plan de Evaluación de Resultados" data={eva} loading={l3} />
        </Link>
      </section>

      <section className="home-links">
        <Link to="/match" className="home-links__card">
          <h3>Match de KPI →</h3>
          <p>Vea qué indicadores se relacionan entre los tres planes institucionales.</p>
        </Link>
        <Link to="/kpis" className="home-links__card">
          <h3>Lista Completa de KPI →</h3>
          <p>Busque, filtre, ordene y exporte todos los indicadores a Excel o PDF.</p>
        </Link>
        <Link to="/oportunidades" className="home-links__card">
          <h3>Oportunidades de Mejora →</h3>
          <p>Indicadores que podrían cambiar de estado con la evidencia adecuada.</p>
        </Link>
      </section>
    </div>
  );
}
