"""Agregaciones para la API: resúmenes por estado, agrupaciones por
dimensión/objetivo, tabla de match de KPI entre los 3 planes y
oportunidades de mejora.
"""

from __future__ import annotations

from collections import OrderedDict

from .excel_reader import (
    ESTADOS_ORDEN,
    KPI,
    OPORTUNIDADES_MEJORA,
    DataBundle,
)


def summary_by_estado(kpis: list[KPI]) -> dict:
    counts = OrderedDict((estado, 0) for estado in ESTADOS_ORDEN)
    for kpi in kpis:
        counts[kpi.estado] = counts.get(kpi.estado, 0) + 1
    return {
        "counts": counts,
        "total": len(kpis),
    }


def group_by_field_and_estado(kpis: list[KPI], field: str) -> list[dict]:
    """Agrupa KPIs por un campo (dimension u objetivo) y cuenta por estado.
    Preserva el orden de primera aparición del campo (que sigue el orden
    natural del Excel).
    """
    groups: "OrderedDict[str, OrderedDict[str, int]]" = OrderedDict()
    for kpi in kpis:
        key = getattr(kpi, field) or "(Sin asignar)"
        if key not in groups:
            groups[key] = OrderedDict((estado, 0) for estado in ESTADOS_ORDEN)
        groups[key][kpi.estado] += 1

    result = []
    for key, estado_counts in groups.items():
        entry = {"grupo": key, "total": sum(estado_counts.values())}
        entry.update(estado_counts)
        result.append(entry)
    return result


def build_match_table(bundle: DataBundle) -> list[dict]:
    """Construye la tabla de MATCH DE KPI (Sección 3) cruzando los 3 planes.

    Fuente primaria: columnas 'KPI del Plan de Efectividad relacionado' y
    'KPI del Plan Estratégico relacionado' de la hoja de Evaluación de
    Resultados (D-xx / I-xx), que ya documentan el cruce. Esto es
    consistente con el PDF de match entregado por el usuario (mismo
    contenido, ya materializado en el Excel).

    Solo se listan indicadores que SÍ tienen relación entre planes,
    conforme a lo solicitado.
    """
    strategic_by_code = {k.codigo: k for k in bundle.estrategico}
    effectiveness_by_code = {k.codigo.strip(): k for k in bundle.efectividad}

    def find_effectiveness(code_text: str):
        """Los códigos vienen a veces concatenados como 'E1-K2 y E5-K3.'"""
        import re
        codes = re.findall(r"E\d+-[IOSK]\d*", code_text)
        return codes

    rows = []
    seen = set()

    for kpi in bundle.evaluacion:
        eff_codes = find_effectiveness(kpi.codigo_relacionado_efectividad)
        strat_codes = find_effectiveness(kpi.codigo_relacionado_estrategico)

        if not eff_codes and not strat_codes:
            continue

        eff_names = []
        for c in eff_codes:
            match = effectiveness_by_code.get(c)
            eff_names.append(f"{c} — {match.nombre}" if match else c)

        strat_names = []
        for c in strat_codes:
            match = strategic_by_code.get(c)
            strat_names.append(f"{c} — {match.nombre}" if match else c)

        key = (kpi.codigo, tuple(eff_codes), tuple(strat_codes))
        if key in seen:
            continue
        seen.add(key)

        rows.append(
            {
                "assessment_codigo": kpi.codigo,
                "assessment_nombre": kpi.nombre,
                "effectiveness_codigo": ", ".join(eff_codes) if eff_codes else "",
                "effectiveness_nombre": "; ".join(eff_names) if eff_names else "",
                "strategic_codigo": ", ".join(strat_codes) if strat_codes else "",
                "strategic_nombre": "; ".join(strat_names) if strat_names else "",
            }
        )

    return rows


def opportunities_list(bundle: DataBundle) -> list[dict]:
    result = []
    for kpi in bundle.all_kpis:
        if kpi.codigo in OPORTUNIDADES_MEJORA:
            result.append(
                {
                    "dashboard": kpi.dashboard,
                    "codigo": kpi.codigo,
                    "nombre": kpi.nombre,
                    "estado_actual": kpi.estado,
                    "mensaje": kpi.oportunidad_mensaje,
                }
            )
    return result
