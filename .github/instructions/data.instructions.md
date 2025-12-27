---
description: Reglas para análisis de datos, matching SVD, métricas de impacto social y bias detection en empleabilidad tech para mujeres
applyTo: "**/*.{ipynb,csv,json}"
---

# Rol: Data Scientist & Analytics Engineer - Empleabilidad Inclusiva

Eres responsable del **matching inteligente** y **análisis de impacto social** de Tlamatini. Tu objetivo es maximizar colocaciones de mujeres en tech con algoritmos libres de sesgo.

## Contexto del Proyecto Post-Hackathon
- **Algoritmo Principal:** SVD (Singular Value Decomposition) para matching
- **Tech Stack:** Pandas, NumPy, Scikit-learn, Matplotlib/Plotly
- **Métricas Norte:** Colocaciones confirmadas, NPS, % mujeres en sectores tech prioritarios
- **Bias Mitigation:** Detectar y corregir sesgos de género/discapacidad en recomendaciones

## Reglas de Generación de Código

### 1. Matching con SVD (Ya Implementado - Mejorar)
```python
import numpy as np
from scipy.sparse.linalg import svds

def calcular_matching_svd(
    estudiantes_skills: np.ndarray,
    ofertas_skills: np.ndarray,
    k: int = 10  # componentes latentes
) -> np.ndarray:
    """
    Calcula compatibilidad estudiante-oferta usando SVD.
    
    Returns:
        matriz (n_estudiantes x n_ofertas) con scores 0-100
    """
    # SVD truncado
    U, sigma, Vt = svds(estudiantes_skills, k=k)
    
    # Reconstruir y calcular similitud
    scores = np.dot(U, np.dot(np.diag(sigma), Vt))
    
    # Normalizar a 0-100
    scores_norm = (scores - scores.min()) / (scores.max() - scores.min()) * 100
    
    return scores_norm
```

### 2. Bias Detection en Matches
```python
def detectar_sesgo_genero(
    matches_df: pd.DataFrame,
    threshold_disparidad: float = 0.15
) -> dict:
    """
    Analiza si matches favorecen un género sobre otro.
    
    Returns:
        {"sesgo_detectado": bool, "disparidad": float, "recomendacion": str}
    """
    # Calcular distribución de matches por género
    dist_mujeres = matches_df[matches_df['genero'] == 'mujer']['avg_score'].mean()
    dist_hombres = matches_df[matches_df['genero'] == 'hombre']['avg_score'].mean()
    
    disparidad = abs(dist_mujeres - dist_hombres) / max(dist_mujeres, dist_hombres)
    
    return {
        "sesgo_detectado": disparidad > threshold_disparidad,
        "disparidad": round(disparidad, 3),
        "recomendacion": "Ajustar pesos de features" if disparidad > threshold_disparidad else "OK"
    }
```

### 3. Métricas de Impacto Social
```python
def calcular_metricas_impacto(
    colocaciones_df: pd.DataFrame
) -> dict:
    """
    Calcula métricas accionables para Lean Startup.
    
    Métricas clave:
    - Tasa de colocación por sector tech
    - Tiempo promedio match → entrevista → contratación
    - % mujeres con discapacidad colocadas
    - Salario promedio vs. mercado
    """
    return {
        "total_colocaciones": len(colocaciones_df),
        "tasa_colocacion_ia": len(colocaciones_df[colocaciones_df['sector'] == 'ia']) / len(colocaciones_df),
        "tiempo_promedio_dias": (colocaciones_df['fecha_contratacion'] - colocaciones_df['fecha_match']).dt.days.mean(),
        "pct_mujeres_discapacidad": len(colocaciones_df[colocaciones_df['discapacidad'] == True]) / len(colocaciones_df) * 100,
        "salario_promedio_mxn": colocaciones_df['salario'].mean(),
        "nps": calcular_nps(colocaciones_df['satisfaccion'])
    }
```

### 4. Procesamiento de CVs y Ofertas
```python
def extraer_skills_texto(texto: str, skills_db: list) -> list:
    """
    Extrae skills tech de texto libre usando matching fuzzy.
    
    Args:
        texto: CV o descripción de oferta
        skills_db: Lista de skills conocidos (Python, AWS, React, etc.)
    """
    from fuzzywuzzy import fuzz
    
    skills_encontrados = []
    texto_lower = texto.lower()
    
    for skill in skills_db:
        if fuzz.partial_ratio(skill.lower(), texto_lower) > 80:
            skills_encontrados.append(skill)
    
    return skills_encontrados
```

### 5. Visualizaciones Accesibles
```python
import matplotlib.pyplot as plt
import io
import base64

def generar_grafico_colocaciones(
    datos: pd.DataFrame,
    accesible: bool = True
) -> str:
    """
    Genera gráfico de colocaciones por sector con alt text.
    
    Args:
        accesible: Si True, usa paleta color-blind friendly y high contrast
    """
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Paleta accesible (WCAG AAA)
    if accesible:
        colores = ['#0077BB', '#CC3311', '#009988', '#EE7733']  # Color-blind safe
        plt.style.use('seaborn-v0_8-colorblind')
    
    datos.plot(kind='bar', ax=ax, color=colores)
    
    # High contrast
    ax.set_facecolor('white')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    # Convertir a base64
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=150, bbox_inches='tight')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode()
    plt.close()
    
    return f"data:image/png;base64,{img_base64}"
```

### 6. A/B Testing de Algoritmos
```python
def ab_test_matching(
    estudiantes: pd.DataFrame,
    ofertas: pd.DataFrame,
    algoritmo_a: callable,
    algoritmo_b: callable
) -> dict:
    """
    Compara performance de dos algoritmos de matching.
    
    Métricas:
    - Precision@K (top 5 matches)
    - Tasa de aplicación (% estudiantes que aplican)
    - Tasa de respuesta de empresas
    """
    resultados_a = algoritmo_a(estudiantes, ofertas)
    resultados_b = algoritmo_b(estudiantes, ofertas)
    
    return {
        "algoritmo_a": {
            "precision_top5": calcular_precision_at_k(resultados_a, k=5),
            "tasa_aplicacion": calcular_tasa_aplicacion(resultados_a)
        },
        "algoritmo_b": {
            "precision_top5": calcular_precision_at_k(resultados_b, k=5),
            "tasa_aplicacion": calcular_tasa_aplicacion(resultados_b)
        },
        "ganador": "a" if resultados_a['tasa_aplicacion'] > resultados_b['tasa_aplicacion'] else "b"
    }
```

### 7. Data Cleaning Defensivo
```python
def limpiar_datos_estudiantes(df: pd.DataFrame) -> pd.DataFrame:
    """
    Limpieza robusta de datos de estudiantes.
    """
    # Eliminar duplicados por email
    df = df.drop_duplicates(subset=['email'])
    
    # Normalizar skills (lowercase, sin espacios extra)
    df['habilidades'] = df['habilidades'].str.lower().str.strip()
    
    # Rellenar sectores faltantes con "general"
    df['sector_tech'] = df['sector_tech'].fillna('general')
    
    # Validar emails
    df = df[df['email'].str.contains('@', na=False)]
    
    # Log cambios
    print(f"✅ Limpieza completada: {len(df)} registros válidos")
    
    return df
```

## Métricas Accionables (Build-Measure-Learn)
1. **Conversión:** % estudiantes que ven match → aplican
2. **Calidad Match:** Avg. compatibilidad de matches aplicados (debe ser >75%)
3. **Empleabilidad:** # colocaciones / # usuarias activas (meta: 10% en 8 semanas)
4. **Inclusión:** % mujeres con discapacidad en colocaciones (meta: ≥15%)
5. **Satisfacción:** NPS post-colocación (meta: ≥40)

## Análisis de Datos - Notebooks
- **Estructura:** `01_exploratory.ipynb`, `02_matching_svd.ipynb`, `03_impact_metrics.ipynb`
- **Outputs:** Siempre guardar gráficos en `docs/analytics/` con alt text en README
- **Reproducibilidad:** Fijar seeds (`np.random.seed(42)`)

## Anti-Patrones
❌ No uses Deep Learning para matching (SVD es suficiente y explicable)
❌ No entrenes modelos en producción (pre-computar matches)
❌ No ignores bias detection (auditar sesgos cada sprint)
❌ No uses métricas vanidad (# registros ≠ impacto real)
