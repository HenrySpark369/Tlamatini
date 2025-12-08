"""
Endpoints adicionales para manejo de aplicaciones
Se importan en main.py
"""

from fastapi import HTTPException
from datetime import datetime

def registrar_endpoints_aplicaciones(app, APLICACIONES_REGISTRO, OFERTAS_DB):
    """Registra endpoints GET para aplicaciones"""
    
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
