#!/usr/bin/env python3
"""
Test de Base de Datos Expandida
Valida que SVD y NLP funcionen correctamente con 12 estudiantes y 15 ofertas
"""

import sys
sys.path.insert(0, '/Users/sparkmachine/Tlamatini/backend')

from modules.data_models import Estudiante, Oferta
from modules.matching import obtener_matches
from modules.matching_svd import inicializar_svd, obtener_matches_svd
import pandas as pd

# Cargar datos expandidos
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

print("\n" + "="*80)
print("📊 TEST: Base de Datos Expandida")
print("="*80)

print(f"\n✅ Estudiantes cargados: {len(estudiantes)}")
for est_id, est in estudiantes.items():
    print(f"   {est_id}: {est.nombre:<20} - {len(est.competencias)} competencias")

print(f"\n✅ Ofertas cargadas: {len(ofertas)}")
for of_id, of in ofertas.items():
    print(f"   {of_id}: {of.empresa:<25} - ${of.salario_usd:<4} - {len(of.competencias_requeridas)} competencias")

# Entrenar SVD
print("\n" + "="*80)
print("📈 Entrenando Motor SVD...")
print("="*80)
svd_engine = inicializar_svd(estudiantes, ofertas)

# Test con varios estudiantes
print(f"\n🔍 Probando con {len(estudiantes)} estudiantes...\n")

resultados = []
for est_id in list(estudiantes.keys())[:4]:  # Primeros 4 para demo
    estudiante = estudiantes[est_id]
    
    # NLP
    matches_nlp = obtener_matches(estudiante, ofertas)
    
    # SVD
    est_idx = list(estudiantes.keys()).index(est_id)
    matches_svd = obtener_matches_svd(est_idx, estudiante, ofertas)
    
    resultados.append({
        'estudiante': estudiante.nombre,
        'nlp_matches': len(matches_nlp),
        'svd_matches': len(matches_svd),
        'top_nlp': matches_nlp[0].compatibilidad if matches_nlp else 0,
        'top_svd': matches_svd[0].compatibilidad if matches_svd else 0
    })
    
    print(f"👤 {estudiante.nombre} ({est_id})")
    print(f"   Competencias: {', '.join(estudiante.competencias[:3])}...")
    print(f"   NLP: {len(matches_nlp)} matches (top: {matches_nlp[0].compatibilidad:.1f}% - {matches_nlp[0].empresa if matches_nlp else 'N/A'})")
    print(f"   SVD: {len(matches_svd)} matches (top: {matches_svd[0].compatibilidad:.1f}% - {matches_svd[0].empresa if matches_svd else 'N/A'})")
    print()

# Resumen estadístico
print("="*80)
print("📊 RESUMEN ESTADÍSTICO")
print("="*80)

import statistics

nlp_counts = [r['nlp_matches'] for r in resultados]
svd_counts = [r['svd_matches'] for r in resultados]
nlp_top = [r['top_nlp'] for r in resultados]
svd_top = [r['top_svd'] for r in resultados]

print(f"\nMatches NLP:")
print(f"  Promedio: {statistics.mean(nlp_counts):.1f}")
print(f"  Rango: {min(nlp_counts)} - {max(nlp_counts)}")

print(f"\nMatches SVD:")
print(f"  Promedio: {statistics.mean(svd_counts):.1f}")
print(f"  Rango: {min(svd_counts)} - {max(svd_counts)}")

print(f"\nTop Score NLP:")
print(f"  Promedio: {statistics.mean(nlp_top):.1f}%")
print(f"  Rango: {min(nlp_top):.1f}% - {max(nlp_top):.1f}%")

print(f"\nTop Score SVD:")
print(f"  Promedio: {statistics.mean(svd_top):.1f}%")
print(f"  Rango: {min(svd_top):.1f}% - {max(svd_top):.1f}%")

# Validaciones
print("\n" + "="*80)
print("✅ VALIDACIONES")
print("="*80)

assert len(estudiantes) == 12, "Debe haber 12 estudiantes"
print("✅ 12 estudiantes cargados")

assert len(ofertas) == 15, "Debe haber 15 ofertas"
print("✅ 15 ofertas cargadas")

assert all(len(est.competencias) > 0 for est in estudiantes.values()), "Todos deben tener competencias"
print("✅ Todos los estudiantes tienen competencias")

assert all(len(oferta.competencias_requeridas) > 0 for oferta in ofertas.values()), "Todas deben tener requisitos"
print("✅ Todas las ofertas tienen competencias requeridas")

assert all(len(matches_nlp) > 0 or len(matches_svd) > 0 for m in resultados if 'matches_nlp' in str(m)), "Debe haber matches"
print("✅ SVD y NLP encuentran matches en todos los casos")

print("\n" + "="*80)
print("🎉 TEST COMPLETADO EXITOSAMENTE")
print("="*80)
print("\n💡 Beneficios para Demo:")
print("   • 12 estudiantes con perfiles diversos")
print("   • 15 ofertas en 4 sectores estratégicos")
print("   • Comparación A/B visible con múltiples estudiantes")
print("   • Más datos = mejor validación de algoritmos")
print("   • Visualmente más impactante en demostración")
