#!/usr/bin/env bash
# Levanta el backend (FastAPI, puerto 8000) y el frontend (Vite, puerto 5173)
# en paralelo, para desarrollo/uso local.
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Instalando dependencias del backend (si hace falta)..."
cd "$ROOT_DIR/backend"
python3 -m venv .venv 2>/dev/null || true
source .venv/bin/activate
pip install -q -r requirements.txt

echo "==> Iniciando backend en http://localhost:8000 ..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "==> Instalando dependencias del frontend (si hace falta)..."
cd "$ROOT_DIR/frontend"
npm install

echo "==> Iniciando frontend en http://localhost:5173 ..."
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
