import { api } from "../api/client";
import { useFetch } from "../utils/useFetch";
import "./MatchPage.css";

export default function MatchPage() {
  const { data, loading, error } = useFetch(() => api.matchTable(), []);
  const rows = data?.data ?? [];

  return (
    <div className="match-page">
      <header className="match-page__intro">
        <h2>Match de KPI</h2>
        <p>
          Indicadores del <strong>Plan de Evaluación de Resultados</strong> (D-xx / I-xx) que
          tienen relación directa con indicadores del <strong>Plan de Efectividad</strong> y del{" "}
          <strong>Plan Estratégico</strong>, según el cruce documentado institucionalmente. Solo
          se listan los KPI que sí tienen relación entre planes.
        </p>
      </header>

      {loading && <p className="match-page__status">Cargando tabla de match…</p>}
      {error && <p className="match-page__status match-page__status--error">Error: {error}</p>}

      {!loading && !error && (
        <div className="match-table-wrap">
          <table className="match-table">
            <thead>
              <tr>
                <th>Código<br />Assessment Plan</th>
                <th>Nombre<br />Assessment Plan</th>
                <th>Código<br />Effectiveness Plan</th>
                <th>Nombre<br />Effectiveness Plan</th>
                <th>Código<br />Strategic Plan</th>
                <th>Nombre<br />Strategic Plan</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="mono match-table__code">{r.assessment_codigo}</td>
                  <td>{r.assessment_nombre}</td>
                  <td className="mono match-table__code">{r.effectiveness_codigo || "—"}</td>
                  <td>{r.effectiveness_nombre || "—"}</td>
                  <td className="mono match-table__code">{r.strategic_codigo || "—"}</td>
                  <td>{r.strategic_nombre || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="match-page__footnote">{rows.length} indicadores con relación identificada.</p>
        </div>
      )}
    </div>
  );
}
