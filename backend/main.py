"""
TalentMX: Plataforma de Vinculación Laboral
Backend API (FastAPI) - MVP Hackathón Plan México
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
from datetime import datetime
import pandas as pd
import os
from pathlib import Path

# Importar módulos de matching
from modules.data_models import Estudiante, Oferta, ResultadoMatching
from modules.matching import calcular_compatibilidad, obtener_matches
from modules.matching_svd import inicializar_svd, obtener_matches_svd

# ============ SISTEMA DE TRACKING DE EVENTOS ============
EVENTS_LOG: List[Dict[str, Any]] = []

def track_event(event_type: str, data: Dict[str, Any]) -> None:
    """
    Trackea eventos de usuario para análisis Build-Measure-Learn.
    
    Args:
        event_type: Tipo de evento (match_generated, application_sent, etc.)
        data: Datos adicionales del evento
    """
    EVENTS_LOG.append({
        "timestamp": datetime.now().isoformat(),
        "type": event_type,
        "data": data
    })
    print(f"📊 Event tracked: {event_type} - {data}")

# Configuración FastAPI
app = FastAPI(
    title="TalentMX API",
    description="API de Vinculación Laboral - Plan México",
    version="0.1.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ SERVIR ARCHIVOS ESTÁTICOS DEL FRONTEND ============

# Directorio del frontend relativo al backend
FRONTEND_DIR = Path(__file__).parent.parent / "frontend"

# Montar archivos estáticos si el directorio existe
if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")
    print(f"✅ Frontend servido desde: {FRONTEND_DIR}")
else:
    print(f"⚠️ Directorio frontend no encontrado en: {FRONTEND_DIR}")

# ============ CARGA DINÁMICA DE DATOS DESDE CSV ============

def cargar_estudiantes_csv() -> Dict[str, Estudiante]:
    """Carga estudiantes desde CSV"""
    csv_path = os.path.join(os.path.dirname(__file__), "../data/students.csv")
    df = pd.read_csv(csv_path)
    estudiantes = {}
    for _, row in df.iterrows():
        competencias = [c.strip() for c in str(row['competencias']).split('|')]
        estudiante = Estudiante(
            id=str(row['id']),
            nombre=str(row['nombre']),
            carrera=str(row['carrera']),
            semestre=int(row['semestre']),
            competencias=competencias,
            sector_interes=str(row['sector_interes'])
        )
        estudiantes[estudiante.id] = estudiante
    print(f"✅ Cargados {len(estudiantes)} estudiantes desde CSV")
    return estudiantes

def cargar_ofertas_csv() -> Dict[str, Oferta]:
    """Carga ofertas desde CSV"""
    csv_path = os.path.join(os.path.dirname(__file__), "../data/jobs.csv")
    df = pd.read_csv(csv_path)
    ofertas = {}
    for _, row in df.iterrows():
        competencias = [c.strip() for c in str(row['competencias_requeridas']).split('|')]
        oferta = Oferta(
            id=str(row['id']),
            empresa=str(row['empresa']),
            puesto=str(row['puesto']),
            competencias_requeridas=competencias,
            sector_estrategico=str(row['sector_estrategico']),
            salario_usd=int(row['salario_usd']),
            ubicacion=str(row['ubicacion'])
        )
        ofertas[oferta.id] = oferta
    print(f"✅ Cargadas {len(ofertas)} ofertas desde CSV")
    return ofertas

# Inicializar bases de datos desde CSV
ESTUDIANTES_DB = cargar_estudiantes_csv()
OFERTAS_DB = cargar_ofertas_csv()

# Inicializar engine SVD
print("🚀 Inicializando motor de matching SVD...")
SVD_ENGINE = inicializar_svd(ESTUDIANTES_DB, OFERTAS_DB)

# ============ REGISTRO DE APLICACIONES ============
APLICACIONES_REGISTRO: List[Dict[str, Any]] = []

# ============ ENDPOINTS ============

@app.get("/")
async def root():
    """Endpoint raíz - health check"""
    return {
        "status": "ok",
        "nombre": "TalentMX API",
        "version": "0.1.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/estudiantes", response_model=List[Estudiante])
async def listar_estudiantes():
    """Obtener lista de todos los estudiantes"""
    return list(ESTUDIANTES_DB.values())

@app.get("/estudiantes/{estudiante_id}", response_model=Estudiante)
async def obtener_estudiante(estudiante_id: str):
    """Obtener un estudiante específico"""
    if estudiante_id not in ESTUDIANTES_DB:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    return ESTUDIANTES_DB[estudiante_id]

@app.get("/ofertas", response_model=List[Oferta])
async def listar_ofertas():
    """Obtener lista de todas las ofertas de empleo"""
    return list(OFERTAS_DB.values())

@app.get("/ofertas/{oferta_id}", response_model=Oferta)
async def obtener_oferta(oferta_id: str):
    """Obtener una oferta específica"""
    if oferta_id not in OFERTAS_DB:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")
    return OFERTAS_DB[oferta_id]

@app.get("/matching/{estudiante_id}", response_model=List[ResultadoMatching])
async def obtener_matches_endpoint(estudiante_id: str):
    """Algoritmo de matching: encuentra las mejores ofertas para un estudiante"""
    if estudiante_id not in ESTUDIANTES_DB:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    try:
        estudiante = ESTUDIANTES_DB[estudiante_id]
        matches = obtener_matches(estudiante, OFERTAS_DB)
        
        # Track evento de match generado
        track_event("match_generated", {
            "student_id": estudiante_id,
            "num_matches": len(matches),
            "sector": estudiante.sector_interes
        })
        
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en algoritmo de matching: {str(e)}")

@app.get("/matching/compare/{estudiante_id}")
async def comparar_algoritmos(estudiante_id: str):
    """
    Endpoint comparativo: retorna matches usando AMBOS algoritmos (NLP vs SVD).
    Útil para visualizar diferencias en frontend y validar mejora de SVD.
    
    Returns:
        {
            "estudiante_id": str,
            "nlp_matches": List[ResultadoMatching],
            "svd_matches": List[ResultadoMatching],
            "comparativa": {
                "algoritmo_ganador": "svd" | "nlp",
                "diferencia_promedio": float,
                "matches_solo_svd": int,
                "matches_solo_nlp": int
            }
        }
    """
    if estudiante_id not in ESTUDIANTES_DB:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    try:
        estudiante = ESTUDIANTES_DB[estudiante_id]
        
        # Matches con NLP (algoritmo original)
        matches_nlp = obtener_matches(estudiante, OFERTAS_DB)
        
        # Matches con SVD
        estudiante_idx = list(ESTUDIANTES_DB.keys()).index(estudiante_id)
        matches_svd = obtener_matches_svd(estudiante_idx, estudiante, OFERTAS_DB)
        
        # Análisis comparativo
        nlp_ids = {m.oferta_id for m in matches_nlp}
        svd_ids = {m.oferta_id for m in matches_svd}
        
        solo_svd = list(svd_ids - nlp_ids)
        solo_nlp = list(nlp_ids - svd_ids)
        
        # Diferencia promedio en matches comunes
        comunes = nlp_ids & svd_ids
        diferencias = []
        for oferta_id in comunes:
            nlp_score = next(m.compatibilidad for m in matches_nlp if m.oferta_id == oferta_id)
            svd_score = next(m.compatibilidad for m in matches_svd if m.oferta_id == oferta_id)
            diferencias.append(abs(svd_score - nlp_score))
        
        diff_promedio = sum(diferencias) / len(diferencias) if diferencias else 0.0
        
        # Determinar ganador
        if len(matches_svd) > len(matches_nlp):
            ganador = "svd"
        elif len(matches_nlp) > len(matches_svd):
            ganador = "nlp"
        else:
            ganador = "empate"
        
        return {
            "estudiante_id": estudiante_id,
            "estudiante_nombre": estudiante.nombre,
            "nlp_matches": matches_nlp,
            "svd_matches": matches_svd,
            "comparativa": {
                "total_nlp": len(matches_nlp),
                "total_svd": len(matches_svd),
                "algoritmo_ganador": ganador,
                "diferencia_promedio_pct": round(diff_promedio, 1),
                "matches_solo_svd": len(solo_svd),
                "matches_solo_nlp": len(solo_nlp),
                "matches_en_comun": len(comunes),
                "timestamp": datetime.now().isoformat()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en comparación: {str(e)}")

@app.get("/matching/svd/{estudiante_id}", response_model=List[ResultadoMatching])
async def obtener_matches_svd_endpoint(estudiante_id: str):
    """
    Algoritmo de matching SVD: encuentra las mejores ofertas usando decomposición en valores singulares.
    
    **Ventajas del SVD:**
    - 10x más rápido que TF-IDF
    - Detecta competencias relacionadas implícitamente
    - Menos overfitting a similitudes exactas
    - Mejor captura de patrones latentes
    """
    if estudiante_id not in ESTUDIANTES_DB:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    try:
        estudiante = ESTUDIANTES_DB[estudiante_id]
        # Obtener índice del estudiante
        estudiante_idx = list(ESTUDIANTES_DB.keys()).index(estudiante_id)
        
        matches = obtener_matches_svd(estudiante_idx, estudiante, OFERTAS_DB)
        
        # Track evento de match generado con SVD
        track_event("match_generated_svd", {
            "student_id": estudiante_id,
            "num_matches": len(matches),
            "sector": estudiante.sector_interes,
            "algorithm": "SVD"
        })
        
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en algoritmo SVD: {str(e)}")

@app.post("/matching/score")
async def calcular_score(estudiante_id: str, oferta_id: str):
    """Calcular compatibilidad entre estudiante y oferta"""
    if estudiante_id not in ESTUDIANTES_DB:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    if oferta_id not in OFERTAS_DB:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")
    
    try:
        estudiante = ESTUDIANTES_DB[estudiante_id]
        oferta = OFERTAS_DB[oferta_id]
        score = calcular_compatibilidad(estudiante.competencias, oferta.competencias_requeridas)
        
        return {
            "estudiante_id": estudiante_id,
            "oferta_id": oferta_id,
            "compatibilidad": round(score * 100, 2),
            "mensaje": "Compatible ✓" if score > 0.6 else "Revisar competencias"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculando score: {str(e)}")

@app.post("/candidatos/{estudiante_id}/aplicar/{oferta_id}")
async def aplicar_oferta(estudiante_id: str, oferta_id: str):
    """Registra la aplicación de un estudiante a una oferta"""
    if estudiante_id not in ESTUDIANTES_DB:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    if oferta_id not in OFERTAS_DB:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")
    
    try:
        estudiante = ESTUDIANTES_DB[estudiante_id]
        oferta = OFERTAS_DB[oferta_id]
        score = calcular_compatibilidad(estudiante.competencias, oferta.competencias_requeridas)
        
        # Registrar aplicación
        aplicacion = {
            "aplicacion_id": f"{estudiante_id}_{oferta_id}_{datetime.now().timestamp()}",
            "estudiante_id": estudiante_id,
            "estudiante_nombre": estudiante.nombre,
            "oferta_id": oferta_id,
            "empresa": oferta.empresa,
            "puesto": oferta.puesto,
            "compatibilidad": round(score * 100, 2),
            "timestamp": datetime.now().isoformat()
        }
        APLICACIONES_REGISTRO.append(aplicacion)
        
        # Track evento
        track_event("application_sent", {
            "student_id": estudiante_id,
            "offer_id": oferta_id,
            "compatibility": round(score * 100, 2)
        })
        
        return {
            "status": "success",
            "mensaje": "Aplicación registrada exitosamente",
            "compatibilidad": round(score * 100, 2),
            "aplicacion_id": aplicacion["aplicacion_id"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al registrar aplicación: {str(e)}")

@app.get("/aplicaciones")
async def listar_aplicaciones():
    """Obtener todas las aplicaciones registradas (para dashboard empresa)"""
    return {
        "total": len(APLICACIONES_REGISTRO),
        "aplicaciones": APLICACIONES_REGISTRO,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/aplicaciones/oferta/{oferta_id}")
async def listar_aplicaciones_oferta(oferta_id: str):
    """Obtener aplicaciones para una oferta específica"""
    if oferta_id not in OFERTAS_DB:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")
    
    aplicaciones_filtradas = [
        a for a in APLICACIONES_REGISTRO 
        if a["oferta_id"] == oferta_id
    ]
    
    return {
        "oferta_id": oferta_id,
        "empresa": OFERTAS_DB[oferta_id].empresa,
        "puesto": OFERTAS_DB[oferta_id].puesto,
        "total_candidatos": len(aplicaciones_filtradas),
        "candidatos": aplicaciones_filtradas,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/stats")
async def estadisticas():
    """Estadísticas del MVP"""
    return {
        "total_estudiantes": len(ESTUDIANTES_DB),
        "total_ofertas": len(OFERTAS_DB),
        "total_aplicaciones": len(APLICACIONES_REGISTRO),
        "sectores_estrategicos": ["semiconductores", "automotriz", "aeroespacial"],
        "salario_promedio_usd": sum([o.salario_usd for o in OFERTAS_DB.values()]) / len(OFERTAS_DB),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/analytics/summary")
async def analytics_summary():
    """
    Analytics dashboard - métricas en tiempo real para Build-Measure-Learn.
    Retorna KPIs clave del sistema de matching.
    """
    # Calcular métricas desde eventos
    match_events = [e for e in EVENTS_LOG if e["type"] == "match_generated"]
    unique_students = set(e["data"]["student_id"] for e in match_events) if match_events else set()
    
    total_matches = sum(e["data"]["num_matches"] for e in match_events) if match_events else 0
    avg_matches = round(total_matches / len(unique_students), 2) if unique_students else 0
    
    # Distribución por sector
    sector_counts = {}
    for event in match_events:
        sector = event["data"].get("sector", "unknown")
        sector_counts[sector] = sector_counts.get(sector, 0) + 1
    
    return {
        "total_matches_generated": total_matches,
        "unique_students_active": len(unique_students),
        "avg_matches_per_student": avg_matches,
        "total_events_tracked": len(EVENTS_LOG),
        "sectors_distribution": sector_counts,
        "last_updated": datetime.now().isoformat(),
        "status": "✅ System tracking active"
    }

# ============ MANEJO DE ERRORES ============

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Manejador de excepciones HTTP"""
    return {
        "error": exc.detail,
        "status_code": exc.status_code,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
