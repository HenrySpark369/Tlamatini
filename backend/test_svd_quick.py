#!/usr/bin/env python3
"""
Test SVD Matching - Validación rápida del nuevo algoritmo
"""

import sys
sys.path.insert(0, '/Users/sparkmachine/Tlamatini/backend')

from modules.data_models import Estudiante, Oferta
from modules.matching import obtener_matches, calcular_compatibilidad
from modules.matching_svd import inicializar_svd, obtener_matches_svd
import pandas as pd

# Cargar datos
df_est = pd.read_csv('/Users/sparkmachine/Tlamatini/data/students.csv')
df_of = pd.read_csv('/Users/sparkmachine/Tlamatini/data/jobs.csv')

estudiantes = {}
for _, row in df_est.iterrows():
    competencias = [c.strip() for c in str(row['competencias']).split('|')]
    est = Estudiante(
        id=str(row['id']),
        nombre=str(row['nombre']),
        carrera=str(row['carrera']),
        semestre=int(row['semestre']),
        competencias=competencias,
        sector_interes=str(row['sector_interes'])
    )
    estudiantes[est.id] = est

ofertas = {}
for _, row in df_of.iterrows():
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

print("\n" + "="*70)
print("🔍 COMPARATIVA: NLP (TF-IDF) vs SVD")
print("="*70)

# Entrenador SVD
print("\n📊 Entrenando motor SVD...")
svd_engine = inicializar_svd(estudiantes, ofertas)

# Prueba con cada estudiante
for est_id, estudiante in estudiantes.items():
    print(f"\n{'='*70}")
    print(f"👤 Estudiante: {estudiante.nombre} ({est_id})")
    print(f"   Carrera: {estudiante.carrera} | Semestre: {estudiante.semestre}")
    print(f"   Competencias: {', '.join(estudiante.competencias)}")
    
    # Matching NLP (TF-IDF)
    print(f"\n🔵 Matching NLP (TF-IDF):")
    matches_nlp = obtener_matches(estudiante, ofertas)
    for i, match in enumerate(matches_nlp, 1):
        print(f"   {i}. {match.empresa} - {match.puesto}")
        print(f"      Compatibilidad: {match.compatibilidad:.1f}%")
        print(f"      Coincidentes: {', '.join(match.competencias_coincidentes) or 'N/A'}")
    
    # Matching SVD
    print(f"\n🟢 Matching SVD:")
    est_idx = list(estudiantes.keys()).index(est_id)
    matches_svd = obtener_matches_svd(est_idx, estudiante, ofertas)
    for i, match in enumerate(matches_svd, 1):
        print(f"   {i}. {match.empresa} - {match.puesto}")
        print(f"      Compatibilidad: {match.compatibilidad:.1f}%")
        print(f"      Coincidentes: {', '.join(match.competencias_coincidentes) or 'N/A'}")
    
    # Comparación
    if matches_nlp and matches_svd:
        best_nlp = matches_nlp[0].compatibilidad
        best_svd = matches_svd[0].compatibilidad
        diff = abs(best_svd - best_nlp)
        print(f"\n📈 Diferencia top match: {diff:.1f}% (NLP: {best_nlp:.1f}% vs SVD: {best_svd:.1f}%)")

print("\n" + "="*70)
print("✅ Test completado exitosamente")
print("="*70)
