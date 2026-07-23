import { NavLink, Outlet } from "react-router-dom";
import "./Layout.css";

const NAV_ITEMS = [
  { to: "/", label: "Resumen General", end: true },
  { to: "/estrategico", label: "Plan Estratégico" },
  { to: "/efectividad", label: "Plan de Efectividad" },
  { to: "/evaluacion", label: "Plan de Evaluación de Resultados" },
  { to: "/match", label: "Match de KPI" },
  { to: "/kpis", label: "Lista Completa de KPI" },
  { to: "/oportunidades", label: "Oportunidades de Mejora" },
];

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <img src="/bgu-seal.svg" alt="Sello institucional BGU" className="app-header__seal" />
          <div>
            <p className="app-header__eyebrow">Blackwell Global University</p>
            <h1 className="app-header__title">Dashboard Ejecutivo de Planeamiento</h1>
          </div>
        </div>
        <div className="app-header__cycle">
          <span>Ciclo 2025 – 2026</span>
          <span className="app-header__cycle-sub">01 sep 2025 – 31 ago 2026</span>
        </div>
      </header>

      <nav className="app-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              "app-nav__link" + (isActive ? " app-nav__link--active" : "")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        Consolidado automáticamente desde los 3 Excel institucionales · Blackwell Global University
      </footer>
    </div>
  );
}
