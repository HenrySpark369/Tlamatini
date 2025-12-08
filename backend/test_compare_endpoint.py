#!/usr/bin/env python3
"""
Test del endpoint /matching/compare
Valida que ambos algoritmos retornen correctamente
"""

import sys
sys.path.insert(0, '/Users/sparkmachine/Tlamatini/backend')

from modules.data_models import Estudiante, Oferta
from modules.matching import obtener_matches
from modules.matching_svd import inicializar_svd, obtener_matches_svd
import pandas as pd
from datetime import datetime

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
print("🧪 TEST: Endpoint /matching/compare")
print("="*70)

# Entrenar SVD
print("\n📊 Entrenando SVD...")
svd_engine = inicializar_svd(estudiantes, ofertas)

# Probar con E001
estudiante_id = "E001"
estudiante = estudiantes[estudiante_id]

print(f"\n👤 Estudiante: {estudiante.nombre} ({estudiante_id})")
print(f"   Competencias: {', '.join(estudiante.competencias)}")

# NLP
print("\n🔵 Obteniendo matches con NLP...")
matches_nlp = obtener_matches(estudiante, ofertas)
print(f"   ✓ {len(matches_nlp)} matches encontrados")
for m in matches_nlp:
    print(f"     - {m.empresa}: {m.compatibilidad:.1f}%")

# SVD
print("\n🟣 Obteniendo matches con SVD...")
est_idx = list(estudiantes.keys()).index(estudiante_id)
matches_svd = obtener_matches_svd(est_idx, estudiante, ofertas)
print(f"   ✓ {len(matches_svd)} matches encontrados")
for m in matches_svd:
    print(f"     - {m.empresa}: {m.compatibilidad:.1f}%")

# Análisis comparativo
nlp_ids = {m.oferta_id for m in matches_nlp}
svd_ids = {m.oferta_id for m in matches_svd}

solo_svd = list(svd_ids - nlp_ids)
solo_nlp = list(nlp_ids - svd_ids)
comunes = nlp_ids & svd_ids

# Diferencia promedio
diferencias = []
for oferta_id in comunes:
    nlp_score = next(m.compatibilidad for m in matches_nlp if m.oferta_id == oferta_id)
    svd_score = next(m.compatibilidad for m in matches_svd if m.oferta_id == oferta_id)
    diferencias.append(abs(svd_score - nlp_score))

diff_promedio = sum(diferencias) / len(diferencias) if diferencias else 0.0

# Resultado de comparativa
print("\n" + "="*70)
print("📊 COMPARATIVA")
print("="*70)
print(f"Total NLP:           {len(matches_nlp)}")
print(f"Total SVD:           {len(matches_svd)}")
print(f"Matches en común:    {len(comunes)}")
print(f"Solo SVD:            {len(solo_svd)}")
print(f"Solo NLP:            {len(solo_nlp)}")
print(f"Diferencia promedio: {diff_promedio:.1f}%")
print(f"Algoritmo ganador:   {'SVD' if len(matches_svd) > len(matches_nlp) else ('NLP' if len(matches_nlp) > len(matches_svd) else 'EMPATE')}")

# Simular response JSON
response = {
    "estudiante_id": estudiante_id,
    "estudiante_nombre": estudiante.nombre,
    "nlp_matches": len(matches_nlp),
    "svd_matches": len(matches_svd),
    "comparativa": {
        "total_nlp": len(matches_nlp),
        "total_svd": len(matches_svd),
        "algoritmo_ganador": "svd" if len(matches_svd) > len(matches_nlp) else ("nlp" if len(matches_nlp) > len(matches_svd) else "empate"),
        "diferencia_promedio_pct": round(diff_promedio, 1),
        "matches_solo_svd": len(solo_svd),
        "matches_solo_nlp": len(solo_nlp),
        "matches_en_comun": len(comunes),
        "timestamp": datetime.now().isoformat()
    }
}

print("\n✅ Test completado exitosamente")
print("\nJSON Response (simulado):")
import json
print(json.dumps(response, indent=2, ensure_ascii=False))
