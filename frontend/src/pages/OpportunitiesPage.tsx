import { api } from "../api/client";
import { useFetch } from "../utils/useFetch";
import "./OpportunitiesPage.css";

export default function OpportunitiesPage() {
  const { data, loading } = useFetch(() => api.opportunities(), []);
  const items = data?.data ?? [];

  return (
    <div className="opportunities-page">
      <header className="opportunities-page__intro">
        <h2>Oportunidades de Mejora</h2>
        <p>
          Indicadores actualmente en estado <strong>No cumplido</strong> que, según el criterio
          institucional, podrían cambiar de estado al incorporarse la evidencia correspondiente.
          No representan un fallo estructural del indicador, sino un vacío de evidencia o de
          instrumento de medición pendiente de resolver.
        </p>
      </header>

      {loading && <p className="opportunities-page__status">Cargando…</p>}

      <div className="opportunities-grid">
        {items.map((o) => (
          <article key={`${o.dashboard}-${o.codigo}`} className="opportunity-card">
            <div className="opportunity-card__top">
              <span className="opportunity-card__badge">Oportunidad de mejora</span>
              <span className="opportunity-card__dashboard">{o.dashboard}</span>
            </div>
            <h3 className="opportunity-card__code mono">{o.codigo}</h3>
            <p className="opportunity-card__name">{o.nombre}</p>
            <div className="opportunity-card__estado">
              Estado actual: <strong>{o.estado_actual}</strong>
            </div>
            <p className="opportunity-card__message">{o.mensaje}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
