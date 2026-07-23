"""Dashboard Ejecutivo BGU — Backend FastAPI.

Lee en vivo los 3 Excel institucionales (Plan Estratégico, Plan de
Efectividad, Plan de Evaluación de Resultados) y expone una API REST
consumida por el frontend React.
"""

from __future__ import annotations

from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from . import aggregations as agg
from .excel_reader import DASHBOARD_NAMES, load_all_data

app = FastAPI(
    title="BGU Dashboard Ejecutivo API",
    description="API de consolidación de los 3 dashboards institucionales de Blackwell Global University",
    version="1.0.0",
)

# CORS abierto: la app se despliega en dominios separados (frontend/backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _dashboard_kpis(bundle, dashboard_key: str):
    mapping = {
        "estrategico": bundle.estrategico,
        "efectividad": bundle.efectividad,
        "evaluacion": bundle.evaluacion,
    }
    if dashboard_key not in mapping:
        raise HTTPException(status_code=404, detail=f"Dashboard '{dashboard_key}' no existe")
    return mapping[dashboard_key]


@app.get("/api/health")
def health():
    bundle = load_all_data()
    return {
        "status": "ok",
        "loaded_at": bundle.loaded_at.isoformat() if bundle.loaded_at else None,
        "counts": {
            "estrategico": len(bundle.estrategico),
            "efectividad": len(bundle.efectividad),
            "evaluacion": len(bundle.evaluacion),
        },
    }


@app.post("/api/reload")
def reload_data():
    """Fuerza una relectura de los 3 archivos Excel desde disco."""
    bundle = load_all_data(force_reload=True)
    return {"status": "reloaded", "loaded_at": bundle.loaded_at.isoformat()}


@app.get("/api/summary/{dashboard_key}")
def summary(dashboard_key: str):
    bundle = load_all_data()
    kpis = _dashboard_kpis(bundle, dashboard_key)
    return {
        "dashboard": DASHBOARD_NAMES[dashboard_key],
        **agg.summary_by_estado(kpis),
    }


@app.get("/api/chart/{dashboard_key}")
def chart(dashboard_key: str):
    """Devuelve datos agrupados listos para graficar.

    - estrategico / efectividad -> agrupado por 'dimension'
    - evaluacion -> agrupado por 'objetivo' (Objetivo 1..7)
    """
    bundle = load_all_data()
    kpis = _dashboard_kpis(bundle, dashboard_key)
    field = "objetivo" if dashboard_key == "evaluacion" else "dimension"
    return {
        "dashboard": DASHBOARD_NAMES[dashboard_key],
        "agrupado_por": field,
        "data": agg.group_by_field_and_estado(kpis, field),
    }


@app.get("/api/match")
def match_table():
    bundle = load_all_data()
    return {"data": agg.build_match_table(bundle)}


@app.get("/api/opportunities")
def opportunities():
    bundle = load_all_data()
    return {"data": agg.opportunities_list(bundle)}


@app.get("/api/kpis")
def all_kpis(
    dashboard: Optional[str] = Query(None, description="estrategico | efectividad | evaluacion"),
    dimension: Optional[str] = None,
    objetivo: Optional[str] = None,
    estado: Optional[str] = None,
    codigo: Optional[str] = None,
    nombre: Optional[str] = None,
):
    """Lista completa de KPI (Sección 'LISTA COMPLETA DE KPI') con filtros
    opcionales por querystring. El filtrado fino (búsqueda instantánea,
    orden de columnas) se hace en el frontend sobre este dataset completo.
    """
    bundle = load_all_data()
    kpis = bundle.all_kpis

    def keep(k):
        if dashboard and DASHBOARD_NAMES.get(dashboard) != k.dashboard:
            return False
        if dimension and dimension.lower() not in (k.dimension or "").lower():
            return False
        if objetivo and objetivo.lower() not in (k.objetivo or "").lower():
            return False
        if estado and estado != k.estado:
            return False
        if codigo and codigo.lower() not in k.codigo.lower():
            return False
        if nombre and nombre.lower() not in (k.nombre or "").lower():
            return False
        return True

    filtered = [k.to_dict() for k in kpis if keep(k)]
    return {"total": len(filtered), "data": filtered}


@app.get("/api/filters")
def filter_options():
    """Devuelve los valores únicos disponibles para poblar los selects de
    filtro en el frontend (Sección 5)."""
    bundle = load_all_data()
    kpis = bundle.all_kpis
    return {
        "dashboards": sorted(set(k.dashboard for k in kpis)),
        "dimensiones": sorted(set(k.dimension for k in kpis if k.dimension)),
        "objetivos": sorted(set(k.objetivo for k in kpis if k.objetivo)),
        "estados": sorted(set(k.estado for k in kpis)),
    }


@app.get("/")
def root():
    return {
        "app": "BGU Dashboard Ejecutivo API",
        "docs": "/docs",
        "endpoints": [
            "/api/health",
            "/api/summary/{dashboard_key}",
            "/api/chart/{dashboard_key}",
            "/api/match",
            "/api/opportunities",
            "/api/kpis",
            "/api/filters",
            "/api/reload (POST)",
        ],
    }
