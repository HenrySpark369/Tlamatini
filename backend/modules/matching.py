"""
Algoritmo de Matching: Compatibilidad Estudiante-Oferta
Usa Scikit-learn para cálculo de similitud
"""

from typing import List, Dict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from .data_models import ResultadoMatching

def calcular_compatibilidad(competencias_estudiante: List[str], 
                           competencias_oferta: List[str]) -> float:
    """
    Calcula compatibilidad entre dos conjuntos de competencias usando similitud coseno.
    
    Args:
        competencias_estudiante: Lista de competencias del estudiante
        competencias_oferta: Lista de competencias requeridas
    
    Returns:
        float: Score de compatibilidad (0-1)
    """
    if not competencias_oferta or not competencias_estudiante:
        return 0.0
    
    try:
        # Crear matriz TF-IDF
        vectorizer = TfidfVectorizer(analyzer='char', ngram_range=(2, 2))
        
        # Todas las competencias únicas
        todas_competencias = list(set(competencias_estudiante + competencias_oferta))
        
        # Si solo hay una competencia, retornar si coincide
        if len(todas_competencias) == 1:
            return 1.0 if competencias_estudiante == competencias_oferta else 0.0
        
        # Vectorizar
        vectores = vectorizer.fit_transform(todas_competencias)
        
        # Calcular similitud coseno promedio
        similitudes = []
        for comp_requerida in competencias_oferta:
            max_similitud = 0.0
            for comp_estudiante in competencias_estudiante:
                try:
                    idx1 = todas_competencias.index(comp_requerida)
                    idx2 = todas_competencias.index(comp_estudiante)
                    similitud = cosine_similarity(
                        vectores[idx1:idx1+1], 
                        vectores[idx2:idx2+1]
                    )[0][0]
                    max_similitud = max(max_similitud, similitud)
                except:
                    pass
            similitudes.append(max_similitud)
        
        # Retornar similitud promedio
        score = np.mean(similitudes) if similitudes else 0.0
        return float(score)
    
    except Exception as e:
        print(f"Error en cálculo de compatibilidad: {e}")
        # Fallback: Match exacto
        coincidencias = len(set(competencias_estudiante) & set(competencias_oferta))
        return coincidencias / len(competencias_oferta) if competencias_oferta else 0.0

def obtener_matches(estudiante, ofertas_db: Dict) -> List[ResultadoMatching]:
    """
    Calcula los mejores matches para un estudiante de todas las ofertas disponibles.
    
    Args:
        estudiante: Objeto Estudiante
        ofertas_db: Diccionario de ofertas disponibles
    
    Returns:
        Lista de ResultadoMatching ordenada por compatibilidad descendente
    """
    resultados = []
    
    for oferta_id, oferta in ofertas_db.items():
        # Calcular compatibilidad
        score = calcular_compatibilidad(
            estudiante.competencias,
            oferta.competencias_requeridas
        )
        
        # Identificar competencias coincidentes y faltantes
        competencias_set_estudiante = set(estudiante.competencias)
        competencias_set_oferta = set(oferta.competencias_requeridas)
        
        coincidentes = list(competencias_set_estudiante & competencias_set_oferta)
        faltantes = list(competencias_set_oferta - competencias_set_estudiante)
        
        # Filtrar: solo mostrar si hay compatibilidad > 30%
        if score >= 0.3:
            resultado = ResultadoMatching(
                oferta_id=oferta_id,
                empresa=oferta.empresa,
                puesto=oferta.puesto,
                compatibilidad=round(score * 100, 1),
                competencias_coincidentes=coincidentes,
                competencias_faltantes=faltantes,
                salario_usd=oferta.salario_usd,
                ubicacion=oferta.ubicacion
            )
            resultados.append(resultado)
    
    # Ordenar por compatibilidad descendente
    resultados.sort(key=lambda x: x.compatibilidad, reverse=True)
    
    return resultados
