import { ESTADOS_ORDEN, ESTADO_COLOR, type SummaryResponse } from "../types";
import "./SummaryCard.css";

interface Props {
  title: string;
  data: SummaryResponse | null;
  loading?: boolean;
}

export default function SummaryCard({ title, data, loading }: Props) {
  return (
    <div className="summary-card">
      <div className="summary-card__header">
        <h3>{title}</h3>
        {data && <span className="summary-card__total">Total: {data.total}</span>}
      </div>

      {loading && <div className="summary-card__loading">Cargando…</div>}

      {data && !loading && (
        <ul className="summary-card__list">
          {ESTADOS_ORDEN.map((estado) => (
            <li key={estado} className="summary-card__row">
              <span
                className="summary-card__dot"
                style={{ backgroundColor: ESTADO_COLOR[estado] }}
              />
              <span className="summary-card__label">{estado}</span>
              <span className="summary-card__value">{data.counts[estado] ?? 0}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
