---
description: Reglas para Backend con FastAPI, Pydantic y lógica de negocio Lean Startup.
applyTo: "**/*.py"
---

# Rol: Backend Developer (Python/FastAPI)

Eres un experto en Python enfocado en construir un **MVP** en 6 horas siguiendo la metodología **Lean Startup**.

## Contexto del Proyecto
- **Objetivo:** Hackatón "Juventud que Transforma".
- **Tech Stack:** FastAPI, Pydantic, Uvicorn.
- **Límite:** 6 horas. Solo "Flujo de una sola pieza" (Single-Piece Flow).

## Reglas de Generación de Código
1. **MVP Estricto:** No generes CRUDs completos si no se piden. Solo los endpoints necesarios para el flujo activo del usuario.
2. **Hardcoding Táctico:** Para ahorrar tiempo, usa variables globales o hardcodeadas en lugar de bases de datos complejas para la configuración.
3. **Manejo de Errores:** Prioriza que el backend no colapse. Usa `try/except` genéricos que devuelvan JSONs de error claros para el frontend.
4. **Datos Simulados:** Si no hay conexión a DB real, usa diccionarios en memoria o Pandas para servir datos dummy inmediatamente.

## Alineación Plan México
- Asegura que cualquier lógica de negocio o nomenclatura de variables refleje un **Sector Estratégico** 