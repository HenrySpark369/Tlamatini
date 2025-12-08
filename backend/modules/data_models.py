"""
Modelos de datos Pydantic para TalentMX
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class SectorEstrategico(str, Enum):
    """Sectores estratégicos del Plan México"""
    SEMICONDUCTORES = "semiconductores"
    AUTOMOTRIZ = "automotriz"
    AEROESPACIAL = "aeroespacial"
    ENERGIA_LIMPIA = "energia_limpia"
    OTRO = "otro"

class Estudiante(BaseModel):
    """Modelo de un estudiante de la Universidad Rosario Castellanos"""
    id: str = Field(..., description="ID único del estudiante")
    nombre: str = Field(..., description="Nombre del estudiante")
    carrera: str = Field(..., description="Carrera/Programa académico")
    semestre: int = Field(..., description="Semestre actual (1-12)")
    competencias: List[str] = Field(..., description="Competencias técnicas del estudiante")
    sector_interes: Optional[str] = Field(None, description="Sector estratégico de interés")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "E001",
                "nombre": "Carlos Mendoza",
                "carrera": "Ingeniería en Electrónica",
                "semestre": 8,
                "competencias": ["Python", "Control de procesos", "Electrónica"],
                "sector_interes": "semiconductores"
            }
        }

class Oferta(BaseModel):
    """Modelo de una oferta de empleo"""
    id: str = Field(..., description="ID único de la oferta")
    empresa: str = Field(..., description="Nombre de la empresa")
    puesto: str = Field(..., description="Título del puesto")
    competencias_requeridas: List[str] = Field(..., description="Competencias requeridas")
    sector_estrategico: str = Field(..., description="Sector estratégico del Plan México")
    salario_usd: float = Field(..., description="Salario mensual en USD")
    ubicacion: str = Field(..., description="Ubicación de la oferta")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "O001",
                "empresa": "Nexperia (Semiconductores)",
                "puesto": "Ingeniero de Procesos",
                "competencias_requeridas": ["Python", "Control de procesos"],
                "sector_estrategico": "semiconductores",
                "salario_usd": 2500,
                "ubicacion": "Guadalajara, Jalisco"
            }
        }

class ResultadoMatching(BaseModel):
    """Resultado del algoritmo de matching"""
    oferta_id: str = Field(..., description="ID de la oferta")
    empresa: str = Field(..., description="Nombre de la empresa")
    puesto: str = Field(..., description="Puesto ofertado")
    compatibilidad: float = Field(..., description="Score de compatibilidad (0-100)")
    competencias_coincidentes: List[str] = Field(..., description="Competencias que coinciden")
    competencias_faltantes: List[str] = Field(..., description="Competencias a desarrollar")
    salario_usd: float = Field(..., description="Salario ofertado")
    ubicacion: str = Field(..., description="Ubicación del empleo")
    
    class Config:
        json_schema_extra = {
            "example": {
                "oferta_id": "O001",
                "empresa": "Nexperia",
                "puesto": "Ingeniero de Procesos",
                "compatibilidad": 85.5,
                "competencias_coincidentes": ["Python", "Control de procesos"],
                "competencias_faltantes": ["Electrónica"],
                "salario_usd": 2500,
                "ubicacion": "Guadalajara"
            }
        }
