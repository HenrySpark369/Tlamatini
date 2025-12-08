"""
TalentMX: Plataforma de Vinculación Laboral
Backend API (FastAPI) - MVP Hackathón Plan México
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime

# Importar módulos de matching
from modules.data_models import Estudiante, Oferta, ResultadoMatching
from modules.matching import calcular_compatibilidad, obtener_matches

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

# ============ DATOS SIMULADOS (MVP - Hardcoding Táctico) ============

ESTUDIANTES_DB = {
    "E001": Estudiante(
        id="E001",
        nombre="Carlos Mendoza",
        carrera="Ingeniería en Electrónica",
        semestre=8,
        competencias=["Python", "Control de procesos", "Electrónica", "PCB design"],
        sector_interes="semiconductores"
    ),
    "E002": Estudiante(
        id="E002",
        nombre="Ana García",
        carrera="Ingeniería Mecatrónica",
        semestre=6,
        competencias=["C++", "Robótica", "PLC", "Automatización industrial"],
        sector_interes="automotriz"
    ),
    "E003": Estudiante(
        id="E003",
        nombre="Miguel López",
        carrera="Ingeniería Aeronáutica",
        semestre=9,
        competencias=["CATIA", "Dinámica de fluidos", "Composite materials", "Análisis estructural"],
        sector_interes="aeroespacial"
    )
}

OFERTAS_DB = {
    "O001": Oferta(
        id="O001",
        empresa="Nexperia (Semiconductores)",
        puesto="Ingeniero de Procesos",
        competencias_requeridas=["Python", "Control de procesos", "Electrónica"],
        sector_estrategico="semiconductores",
        salario_usd=2500,
        ubicacion="Guadalajara, Jalisco"
    ),
    "O002": Oferta(
        id="O002",
        empresa="Tesla Manufacturing",
        puesto="Especialista en Automatización",
        competencias_requeridas=["C++", "PLC", "Robótica", "Automatización industrial"],
        sector_estrategico="automotriz",
        salario_usd=3000,
        ubicacion="CDMX"
    ),
    "O003": Oferta(
        id="O003",
        empresa="Airbus Mexico",
        puesto="Ingeniero Estructural",
        competencias_requeridas=["CATIA", "Análisis estructural", "Composite materials"],
        sector_estrategico="aeroespacial",
        salario_usd=3500,
        ubicacion="Querétaro"
    )
}

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
async def obtener_matches(estudiante_id: str):
    """Algoritmo de matching: encuentra las mejores ofertas para un estudiante"""
    if estudiante_id not in ESTUDIANTES_DB:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    try:
        estudiante = ESTUDIANTES_DB[estudiante_id]
        matches = obtener_matches(estudiante, OFERTAS_DB)
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en algoritmo de matching: {str(e)}")

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

@app.get("/stats")
async def estadisticas():
    """Estadísticas del MVP"""
    return {
        "total_estudiantes": len(ESTUDIANTES_DB),
        "total_ofertas": len(OFERTAS_DB),
        "sectores_estrategicos": ["semiconductores", "automotriz", "aeroespacial"],
        "salario_promedio_usd": sum([o.salario_usd for o in OFERTAS_DB.values()]) / len(OFERTAS_DB),
        "timestamp": datetime.now().isoformat()
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
