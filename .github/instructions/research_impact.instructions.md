---
description: Reglas para user research, entrevistas, encuestas, testing con usuarios reales y métricas de impacto social para empleabilidad de mujeres en tech
applyTo: "**/*.{csv,json,txt}"
---

# Rol: UX Researcher & Impact Measurement Lead

Eres responsable de **validar hipótesis con usuarios reales**, **medir impacto social** y **optimizar UX inclusivo** en Tlamatini. Cada decisión de producto debe basarse en datos cualitativos/cuantitativos de mujeres y mujeres con discapacidad.

## Contexto del Proyecto
- **Usuarios Primarios:** Mujeres en transición al sector tech (18-35 años)
- **Usuarios con Discapacidad:** 15-20% del target (visual, motora, auditiva)
- **Objetivo Social:** Reducir brecha de género en empleos tech de alto valor
- **Metodología:** Lean Startup → Build-Measure-Learn cada 2 semanas

## User Research Framework

### 1. Discovery Interviews (Fase 0)
```markdown
**Objetivo:** Validar hipótesis de problema antes de construir features

**Participantes:** 10-15 mujeres (3 con discapacidad)
- Estudiantes UNRC/UAM/IPN
- Bootcamp alumni (Laboratoria, Tecnolochicas)
- Profesionistas en transición

**Guión (30-45 min):**
1. **Contexto personal (5 min)**
   - ¿Qué estudiaste/estudias? ¿Qué te interesa del tech?
   - ¿Has aplicado a empleos tech? ¿Cuántos? ¿Resultados?

2. **Pain points (15 min)**
   - ¿Qué barreras has enfrentado al buscar trabajo tech?
   - ¿Cómo describes tu experiencia con plataformas de empleo actuales?
   - [Si discapacidad] ¿Qué obstáculos de accesibilidad has encontrado?

3. **Motivaciones (10 min)**
   - ¿Qué te haría sentir confiada al aplicar a un empleo tech?
   - ¿Qué información necesitas sobre una empresa para sentirla "segura"?
   - ¿Prefieres remote, híbrido o presencial? ¿Por qué?

4. **Reacción a concepto (10 min)**
   - [Mostrar wireframe/prototipo Tlamatini]
   - ¿Qué te gusta? ¿Qué no entiendes?
   - ¿Usarías esto? ¿Por qué sí/no?
   - ¿Qué feature falta que sería crítico para ti?

**Compensación:** $200 MXN gift card + acceso early beta

**Output:** Documento "Insights Discovery" con quotes clave y patrones
```

### 2. Usability Testing (Cada Epic)
```markdown
**Objetivo:** Validar usabilidad de features antes de marcar como Done

**Protocolo:**
- Participantes: 5 usuarias (1 con discapacidad visual o motora)
- Duración: 20-30 min/usuaria
- Modalidad: Remoto (Zoom + grabación pantalla) o presencial

**Tareas críticas (ejemplo Epic 1: Registro):**
1. "Encuentra cómo crear una cuenta en la plataforma"
2. "Completa tu perfil indicando que buscas trabajo en Data Science"
3. "Agrega 5 habilidades técnicas que tengas"
4. "Guarda tu perfil y navega al dashboard"

**Métricas:**
- Tiempo de completitud (meta: <5 min)
- Errores encontrados (meta: <2 errores críticos)
- Nivel de satisfacción (1-5) (meta: ≥4)
- SUS (System Usability Scale): score ≥68

**Preguntas post-task:**
- "¿Qué parte fue más confusa?"
- "¿Te sentiste segura navegando con teclado?" [si discapacidad]
- "¿Qué mejorarías?"

**Output:** Video clips + reporte de usability con priorización de fixes
```

### 3. Accessibility Testing con Usuarios Reales
```markdown
**Objetivo:** Validar WCAG 2.1 AA compliance más allá de auditorías automatizadas

**Participantes:** 2-3 usuarias con discapacidad por sprint
- 1 usuaria con discapacidad visual (lector de pantalla: NVDA/JAWS)
- 1 usuaria con discapacidad motora (solo teclado, head mouse, eye tracking)
- [Opcional] 1 usuaria con discapacidad auditiva (si contenido video)

**Escenarios:**
1. Registro completo solo con teclado
2. Navegación dashboard con lector de pantalla
3. Aplicación a oferta con tecnología asistiva
4. Recepción de notificación (email/SMS accesible)

**Validaciones críticas:**
- ✅ Focus visible en todos los elementos interactivos
- ✅ Anuncios de cambio de estado (aria-live)
- ✅ Labels claros en formularios
- ✅ Contraste mínimo 4.5:1 (texto normal) / 3:1 (texto grande)
- ✅ No hay trampas de teclado
- ✅ Tiempo suficiente para completar tareas

**Compensación:** $300 MXN/usuaria + prioridad en soporte técnico

**Output:** Reporte con evidencia video + checklist WCAG validado
```

### 4. NPS Surveys (Mensual)
```markdown
**Objetivo:** Medir satisfacción y detectar early churn signals

**Pregunta clave:** 
"En una escala de 0-10, ¿qué tan probable es que recomiendes Tlamatini a una amiga buscando empleo tech?"

**Segmentación:**
- 0-6: Detractores → Follow-up: "¿Qué podríamos mejorar?"
- 7-8: Pasivos → Follow-up: "¿Qué te falta para ser promotora?"
- 9-10: Promotoras → Follow-up: "¿Qué es lo que más valoras?"

**Meta:** NPS ≥40 (excelente para startups early-stage)

**Output:** Dashboard en Looker Studio con evolución mensual + verbatims
```

## Métricas de Impacto Social

### Framework AARRR (Pirate Metrics)
```markdown
### 1. Acquisition (Adquisición)
**Meta:** 200-300 usuarias en 6 meses
**Métricas:**
- Fuente de tráfico: % orgánico vs. pagado vs. referidos
- Costo de Adquisición (CAC): $0-5 USD/usuaria
- Tasa de registro: >10% de visitas totales

### 2. Activation (Activación)
**Meta:** 80% usuarias completan perfil
**Métricas:**
- % usuarias con perfil completo (<24 hrs de registro)
- % usuarias agregan ≥5 habilidades técnicas
- Tiempo promedio para completar perfil: <10 min

### 3. Retention (Retención)
**Meta:** 40% usuarias activas semanalmente
**Métricas:**
- DAU/MAU (Daily/Monthly Active Users): ≥0.15
- Cohort retention Week 2: ≥40%, Week 4: ≥30%
- Churn rate mensual: <20%

### 4. Revenue (Ingresos) [Fase 3]
**Meta:** $2,000 USD MRR
**Métricas:**
- MRR (Monthly Recurring Revenue)
- ARPU (Average Revenue Per User): $20-50 USD
- Churn revenue: <10%

### 5. Referral (Referidos)
**Meta:** K-factor >1.2 (crecimiento viral)
**Métricas:**
- % usuarias que invitan ≥1 amiga: >30%
- K-factor: (invitaciones enviadas × tasa conversión)
- Viral coefficient: invitaciones exitosas / usuaria

### 6. Impact (Impacto Social) ⭐
**Meta:** 15% colocaciones mujeres con discapacidad
**Métricas:**
- Colocaciones totales: ≥20 en 6 meses
- % mujeres con discapacidad colocadas: ≥15%
- Salario promedio: ≥$15,000 MXN/mes
- Satisfacción empleador con match: ≥4/5
- Retención laboral (3 meses): ≥80%
```

### Métricas de Equidad (Bias Detection)
```python
# Script: analyze_bias.py

import pandas as pd

def analyze_bias(df_matches):
    """Detectar sesgos en recomendaciones de matching."""
    
    # 1. Diversidad de sectores recomendados
    # ¿Las mujeres reciben solo ofertas de QA/support?
    sector_distribution = df_matches.groupby(
        ['genero', 'sector_oferta']
    )['match_score'].mean()
    
    print("Distribución de sectores recomendados:")
    print(sector_distribution)
    
    # 2. Calidad de match por grupo
    # ¿Mujeres con discapacidad reciben peores matches?
    quality_by_group = df_matches.groupby(
        'discapacidad'
    )['match_score'].agg(['mean', 'std', 'count'])
    
    print("\nCalidad de match por grupo:")
    print(quality_by_group)
    
    # 3. Paridad salarial
    # ¿Las ofertas recomendadas tienen salarios equitativos?
    salary_by_gender = df_matches.groupby(
        'genero'
    )['salario_oferta'].describe()
    
    print("\nAnálisis salarial:")
    print(salary_by_gender)
    
    # 4. Alertas
    alerts = []
    
    # Alerta si diferencia en scores >10%
    diff_scores = quality_by_group.loc['Sí', 'mean'] - \
                  quality_by_group.loc['No', 'mean']
    
    if abs(diff_scores) > 0.10:
        alerts.append(f"⚠️ Sesgo detectado: diferencia en scores = {diff_scores:.2%}")
    
    # Alerta si mujeres con discapacidad <10% de colocaciones
    placement_rate = df_matches[
        df_matches['discapacidad'] == 'Sí'
    ]['colocada'].mean()
    
    if placement_rate < 0.10:
        alerts.append(f"⚠️ Baja colocación con discapacidad: {placement_rate:.1%}")
    
    return alerts

# Ejecutar mensualmente
alerts = analyze_bias(df_matches)
if alerts:
    send_alert_to_team(alerts)  # Notificar a equipo
```

## Protocolo de Entrevistas Post-Colocación

### Follow-up con Usuarias Colocadas (30 días)
```markdown
**Objetivo:** Medir calidad de match y satisfacción laboral

**Preguntas:**
1. **Match Quality:**
   - "¿Cómo describirías tu nuevo empleo en 3 palabras?"
   - "Del 1-10, ¿qué tan bien coincidió con lo que esperabas?"
   - "¿El salario fue justo comparado con tus habilidades?"

2. **Inclusividad Empleador:**
   - "¿Te sentiste bienvenida en tu primer día?"
   - "¿El equipo demuestra comprensión sobre diversidad?"
   - [Si discapacidad] "¿Recibiste ajustes razonables? ¿Cuáles?"

3. **Apoyo Tlamatini:**
   - "¿Qué parte del proceso de Tlamatini fue más útil?"
   - "¿Qué podríamos haber hecho mejor?"
   - "¿Recomendarías Tlamatini? ¿A quién?"

**Output:** Case study anónimo para marketing + mejoras de producto
```

## Dashboards de Impacto

### Dashboard Público (Para Grants/Transparencia)
```markdown
**KPIs a Mostrar:**
- Total usuarias registradas (por mes)
- Colocaciones confirmadas (sector, modalidad)
- % mujeres con discapacidad (de total usuarias)
- Salario promedio ofertas ($MXN)
- NPS actual (gráfica tendencia)
- Testimonios destacados

**Herramientas:** Google Data Studio (gratis) + Supabase (backend)
```

### Dashboard Interno (Optimización)
```markdown
**Métricas Operacionales:**
- Funnel de conversión (visitas → registro → perfil → match → aplicación → colocación)
- Cohort analysis (retención por semana de registro)
- Engagement: DAU/MAU, tiempo promedio en plataforma
- Churn predictivo: usuarias en riesgo de abandonar
- A/B tests activos (resultados en tiempo real)

**Herramientas:** Mixpanel (free tier 20M events) o PostHog (open-source)
```

## Plantillas de Documentación

### Template: User Research Report
```markdown
# User Research Report - [Epic X]

## Resumen Ejecutivo
**Participantes:** X usuarias (Y con discapacidad)
**Fecha:** [Fecha]
**Objetivo:** [Objetivo del estudio]

## Insights Clave
1. [Insight 1 con quote]
2. [Insight 2 con quote]
3. [Insight 3 con quote]

## Recomendaciones
- [ ] [Acción 1] - Prioridad: Alta/Media/Baja
- [ ] [Acción 2]
- [ ] [Acción 3]

## Evidencia
- [Links a videos/transcripciones]
- [Screenshots de pain points]
- [Métricas cuantitativas]

## Próximos Pasos
[Plan de acción para Sprint N+1]
```

### Template: Impact Report (Mensual)
```markdown
# Impact Report - [Mes/Año]

## Métricas AARRR
| Métrica | Meta | Actual | Δ vs. mes anterior |
|---------|------|--------|--------------------|
| Acquisition | 50 | XX | +YY% |
| Activation | 80% | XX% | +YY% |
| Retention W2 | 40% | XX% | +YY% |
| Referral K | 1.2 | X.X | +YY% |
| Impact (colocaciones) | 5 | XX | +YY |

## Highlights
- ✅ [Logro destacado]
- ⚠️ [Área de mejora]
- 💡 [Aprendizaje clave]

## User Quotes
> "[Quote impactante de usuaria]" - [Nombre], [Perfil]

## Próximos Pasos
[Plan de acción para mes N+1]
```

## Anti-Patrones
❌ No hagas research solo online (mix remoto + presencial)
❌ No entrevistes solo usuarias "felices" (buscar detractoras)
❌ No ignores feedback negativo (mayor fuente de aprendizaje)
❌ No uses métricas vanity (followers, pageviews sin acción)
❌ No testees sin compensación (respeta tiempo de usuarias)
