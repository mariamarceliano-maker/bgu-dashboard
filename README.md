# Dashboard Ejecutivo BGU — Consolidación de Planes Institucionales

Aplicación web full-stack que consolida en un único panel ejecutivo los 3
dashboards institucionales de **Blackwell Global University**:

1. **Plan Estratégico** 2023-2028 (seguimiento 2025-2026)
2. **Plan de Efectividad** 2025-2026
3. **Plan de Evaluación de Resultados** 2025-2026

La aplicación **lee directamente los archivos Excel** (no hay datos
ingresados manualmente ni hardcodeados). Si reemplazas los Excel en
`backend/app/data/` y llamas a `POST /api/reload`, el dashboard se
actualiza solo.

---

## 1. Arquitectura

```
bgu-dashboard/
├── backend/                    FastAPI (Python)
│   ├── app/
│   │   ├── main.py             Endpoints REST
│   │   ├── excel_reader.py     Lectura y normalización de los 3 Excel
│   │   ├── aggregations.py     Resúmenes, agrupaciones, match, oportunidades
│   │   └── data/                Los 3 archivos .xlsx (fuente de verdad)
│   ├── requirements.txt
│   └── render.yaml             Config de despliegue en Render
│
├── frontend/                   React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── api/client.ts       Cliente HTTP tipado hacia el backend
│   │   ├── types/index.ts      Tipos compartidos (KPI, Estado, etc.)
│   │   ├── components/         Layout, FilterBar, SummaryCard, gráfico Plotly
│   │   ├── pages/               Resumen, 3 planes, Match, Lista, Oportunidades
│   │   └── utils/               exportKpisToExcel / exportKpisToPdf, useFetch
│   └── vercel.json             Config de despliegue en Vercel
│
└── start_local.sh              Levanta backend + frontend en un solo comando
```

**Stack:** React + TypeScript (frontend) · Python + FastAPI (backend) ·
Pandas/OpenPyXL (lectura de Excel) · Plotly (gráficos) · AG Grid
(tabla interactiva) · SheetJS/jsPDF (exportación).

### Cómo se leen los Excel (importante)

Cada uno de los 3 Excel tiene una hoja de "registro" con una estructura
distinta, mapeada así:

| Dashboard | Hoja leída | Columna Dimensión | Columna Estado |
|---|---|---|---|
| Plan Estratégico | `Registro Nuevo - Reporte 2025 -` | `Dimensión` | `Estado` |
| Plan de Efectividad | `Registro Nuevo - Reporte 2025 -` | `Estrategia` | `Estado` |
| Plan de Evaluación de Resultados | `Registro - Reporte 2025 - 2026` | `Alineación de IO` → Objetivo 1-7 | `ESTADO` |

**Supuesto documentado:** en el Plan de Evaluación de Resultados, algunos
indicadores están alineados a más de un objetivo institucional (ej. `IO-1,
IO-4, IO-7`). Para la agrupación del gráfico por objetivo, se usa el
**primer** IO listado como objetivo primario. Esto está declarado también
en la propia página del dashboard.

**Estados canónicos** (se normalizan variantes de mayúsculas/espacios del
Excel a estos 5): `Cumplido`, `Parcialmente cumplido`, `No cumplido`,
`Sin datos`, `No aplicable / Cohorte no madura`.

**Tabla de Match:** se construye automáticamente cruzando las columnas
`KPI del Plan de Efectividad relacionado` y `KPI del Plan Estratégico
relacionado` de la hoja de Evaluación de Resultados — el mismo cruce que
documenta el PDF de match proporcionado. Solo se listan los indicadores
que sí tienen relación entre planes.

**Oportunidades de mejora:** lista fija definida por el usuario
(E3-K3, E3-K4, E3-O01, E3-O02, D-01, D-02, D-04), implementada en
`backend/app/excel_reader.py` → `OPORTUNIDADES_MEJORA`.

---

## 2. Instalación y ejecución local

### Requisitos
- Python 3.10+
- Node.js 18+

### Opción A — un solo comando

```bash
./start_local.sh
```

Levanta el backend en `http://localhost:8000` y el frontend en
`http://localhost:5173`.

### Opción B — manual

**Backend:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # En Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Verifica en `http://localhost:8000/docs` (documentación interactiva
Swagger generada automáticamente).

**Frontend** (en otra terminal):
```bash
cd frontend
npm install
npm run dev
```
Abre `http://localhost:5173`.

> El frontend usa la variable de entorno `VITE_API_URL` para saber dónde
> está el backend. Por defecto apunta a `http://localhost:8000`
> (ver `frontend/.env.development`).

### Actualizar los datos

Reemplaza los 3 archivos en `backend/app/data/` (deben mantener los mismos
nombres: `plan_estrategico.xlsx`, `plan_efectividad.xlsx`,
`plan_evaluacion_resultados.xlsx`) y llama:

```bash
curl -X POST http://localhost:8000/api/reload
```

O simplemente reinicia el backend.

---

## 3. Despliegue gratuito (obtener una URL pública)

Se despliega el backend y el frontend por separado, ambos en planes
gratuitos: **Render** (backend FastAPI) + **Vercel** (frontend React).

### Paso 1 — Subir el proyecto a GitHub

```bash
cd bgu-dashboard
git init
git add .
git commit -m "Dashboard Ejecutivo BGU"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/bgu-dashboard.git
git push -u origin main
```

### Paso 2 — Backend en Render

1. Entra a [render.com](https://render.com) y crea una cuenta gratuita
   (puedes usar tu cuenta de GitHub).
2. Click en **New +** → **Web Service**.
3. Conecta tu repositorio `bgu-dashboard`.
4. Configura:
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
5. Click **Create Web Service**. Tras el build (2-3 min), Render te da una
   URL pública, por ejemplo:
   `https://bgu-dashboard-api.onrender.com`
6. Verifica que funciona abriendo `https://TU-URL.onrender.com/api/health`.

> **Nota sobre el plan gratuito de Render:** el servicio "duerme" tras ~15
> minutos de inactividad y la primera petición tras dormir tarda ~30-50
> segundos en responder (cold start). Es normal en el plan free.

### Paso 3 — Frontend en Vercel

1. Entra a [vercel.com](https://vercel.com) y crea una cuenta gratuita.
2. Click en **Add New** → **Project** → importa el mismo repositorio.
3. Configura:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (se detecta automáticamente)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. En **Environment Variables**, agrega:
   - `VITE_API_URL` = `https://TU-URL-DE-RENDER.onrender.com`
     (la URL del backend del Paso 2, **sin** slash final)
5. Click **Deploy**. En 1-2 minutos obtienes tu URL pública, por ejemplo:
   `https://bgu-dashboard.vercel.app`

Listo: esa URL de Vercel es el link que puedes compartir y abrir desde
cualquier dispositivo.

### Alternativa todo-en-uno: Railway

Si prefieres un solo proveedor para backend y frontend, 
[railway.app](https://railway.app) también ofrece un plan gratuito con
créditos mensuales y permite desplegar ambos servicios (`backend/` y
`frontend/`) como dos servicios dentro del mismo proyecto, de forma muy
similar a los pasos de Render descritos arriba.

---

## 4. Estructura de la API (backend)

| Endpoint | Descripción |
|---|---|
| `GET /api/health` | Estado del servicio y fecha de última lectura de los Excel |
| `POST /api/reload` | Fuerza una relectura de los 3 Excel desde disco |
| `GET /api/summary/{dashboard}` | Conteo de KPI por estado (`estrategico`\|`efectividad`\|`evaluacion`) |
| `GET /api/chart/{dashboard}` | Datos agrupados por dimensión (o por objetivo en `evaluacion`) listos para graficar |
| `GET /api/match` | Tabla de cruce de KPI entre los 3 planes |
| `GET /api/opportunities` | Lista de KPI marcados como oportunidad de mejora |
| `GET /api/kpis` | Lista completa de KPI, con filtros opcionales por querystring |
| `GET /api/filters` | Valores únicos disponibles para poblar los selects de filtro |

Documentación interactiva completa (Swagger): `/docs`.

---

## 5. Funcionalidades implementadas (checklist del brief)

- [x] Lectura automática de los 3 Excel (sin ingreso manual de datos)
- [x] Resumen por estado para cada uno de los 3 dashboards
- [x] Gráfico de barras apiladas por Dimensión (Estratégico y Efectividad)
- [x] Gráfico de barras apiladas por Objetivo (Evaluación de Resultados)
- [x] Pestaña "Match de KPI" con cruce entre los 3 planes
- [x] Pestaña "Lista Completa de KPI" con búsqueda, filtros, orden de
      columnas (AG Grid) y exportación a Excel/PDF
- [x] Tarjetas de "Oportunidades de Mejora" (E3-K3, E3-K4, E3-O01, E3-O02,
      D-01, D-02, D-04)
- [x] Filtros globales por Dashboard, Dimensión, Objetivo, Estado, Código
      y Nombre de KPI
- [x] Interfaz moderna, responsive, con colores institucionales,
      animaciones suaves y gráficos interactivos
- [x] Instrucciones de despliegue gratuito (Render + Vercel)

---

## 6. Notas técnicas y supuestos

- Los nombres de "Dimensión" difieren ligeramente entre los 3 archivos
  originales (mayúsculas/minúsculas, prefijos como `E1. `). El backend los
  normaliza a un formato consistente (`Title Case` en español) para que
  los filtros y agrupaciones funcionen de forma coherente.
- Los valores de "Meta"/"Resultado" que en el Excel vienen como fracción
  (`0.85`) se formatean como porcentaje (`85.0%`) para lectura humana; los
  valores ya en formato texto (`USD 3.6M`, `20 países`) se muestran tal
  cual.
- El backend cachea los datos en memoria tras la primera lectura por
  rendimiento; usa `POST /api/reload` para forzar una relectura tras
  actualizar los archivos Excel.
