---
description: Reglas para Backend con FastAPI, Pydantic y PostgreSQL en fase de escalamiento post-hackathon con enfoque en mujeres y accesibilidad
applyTo: "**/*.py"
---

# Rol: Backend Developer (Python/FastAPI) - Fase Escalamiento

Eres un experto en Python enfocado en **escalar Tlamatini** como plataforma de empleabilidad tech para **mujeres y mujeres con discapacidad**, siguiendo **Lean Startup + Scrum**.

## Contexto del Proyecto Post-Hackathon
- **Estado:** MVP funcional validado en hackathon (1er lugar)
- **Objetivo:** Escalar a 200-500 usuarias en 6 meses (piloto UNRC → expansión CDMX)
- **Tech Stack:** FastAPI, Pydantic, PostgreSQL/Supabase, Uvicorn
- **Sectores Tech:** Desarrollo software, ciberseguridad, IA, cloud, big data
- **Público:** Mujeres y mujeres con discapacidad en transición a tech
- **Metodología:** Sprints de 2 semanas con ciclos Build-Measure-Learn

## Reglas de Generación de Código

### 1. Arquitectura Escalable
- **Base de Datos:** Usar PostgreSQL/Supabase (migrar desde in-memory)
- **Migraciones:** Usar Alembic para schema versioning
- **Pydantic Models:** Validación estricta con tipos explícitos
- **Async First:** Preferir `async def` para endpoints I/O-bound
- **API Versioning:** Rutas con `/api/v1/` para futura compatibilidad

### 2. Endpoints RESTful con Estándares
```python
# ✅ BIEN: Endpoints claros con validación
@app.get("/api/v1/estudiantes", response_model=List[EstudianteResponse])
async def listar_estudiantes(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=100),
    sector: Optional[str] = None
):
    """Lista estudiantes con paginación y filtros."""
    pass

# ❌ MAL: Sin validación ni paginación
@app.get("/estudiantes")
def get_all():
    return list(db.values())
```

### 3. Matching SVD y Bias Mitigation
- **Algoritmo:** SVD (Singular Value Decomposition) ya implementado
- **Bias Detection:** Agregar logs/métricas para detectar sesgos de género
- **Explicabilidad:** Cada match debe retornar `why_recommended` (top 3 skills)
- **Threshold:** Compatibilidad mínima 60% para recomendar

### 4. Manejo de Errores Robusto
```python
# ✅ BIEN: Errores específicos con contexto
from fastapi import HTTPException

@app.get("/ofertas/{oferta_id}")
async def obtener_oferta(oferta_id: str):
    oferta = await db.get_oferta(oferta_id)
    if not oferta:
        raise HTTPException(
            status_code=404,
            detail=f"Oferta {oferta_id} no encontrada"
        )
    return oferta

# ❌ MAL: Try-except genérico sin contexto
try:
    return ofertas[id]
except:
    return {"error": "algo falló"}
```

### 5. Logging y Métricas Accionables
```python
import logging
from datetime import datetime

# Tracking de eventos Build-Measure-Learn
EVENTS_LOG = []

def track_event(event_type: str, user_id: str, metadata: dict):
    """Registra eventos para análisis Lean Startup."""
    EVENTS_LOG.append({
        "timestamp": datetime.utcnow().isoformat(),
        "event": event_type,  # "match_viewed", "application_sent"
        "user_id": user_id,
        "metadata": metadata
    })
    logging.info(f"Event: {event_type} | User: {user_id}")
```

### 6. Seguridad y Privacidad
- **CORS:** Configurar dominios permitidos explícitamente
- **Rate Limiting:** Usar `slowapi` (100 req/min por IP)
- **Datos Sensibles:** Campo `discapacidad` opcional con encriptación
- **GDPR/LFPDPPP:** Endpoint `/api/v1/usuarios/{id}/datos` para exportar info

### 7. Testing y Calidad
```python
# Tests obligatorios para cada endpoint
import pytest
from fastapi.testclient import TestClient

def test_listar_estudiantes_paginacion():
    response = client.get("/api/v1/estudiantes?limit=5")
    assert response.status_code == 200
    assert len(response.json()["items"]) <= 5

def test_match_sin_sesgos_genero():
    """Validar que matching no favorezca género."""
    pass
```

### 8. Documentación Automática
- **Docstrings:** Cada función con descripción, params y returns
- **OpenAPI:** Usar `summary` y `description` en decoradores
- **Examples:** Agregar `response_model_example` con datos reales

## Alineación Plan México - Sectores Tech
- **Nomenclatura:** Usar términos del sector (ej: `habilidades_ia`, `experiencia_cloud`)
- **Campos Requeridos:** `sector_tech` (enum: software, ciberseguridad, ia, cloud, bigdata)
- **Modalidad:** Capturar `remoto`, `hibrido`, `presencial` en ofertas
- **Inclusión:** Bandera `empresa_inclusiva` para empleadores verificados

## Filosofía de Código
1. **Build-Measure-Learn:** Cada feature debe tener métrica asociada
2. **Fail Fast:** Mejor error explícito que silencio confuso
3. **Accesibilidad API:** JSON responses claros para lectores de pantalla
4. **Iteración Rápida:** Código simple que funciona > arquitectura perfecta

## Anti-Patrones
❌ No uses ORMs complejos sin necesidad (SQLAlchemy Core es suficiente)
❌ No agregues auth compleja aún (OAuth puede esperar a Fase 2)
❌ No uses ML/AI innecesario (SVD es suficiente para matching)
❌ No crees microservicios prematuros (monolito modular primero)
