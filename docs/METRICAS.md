# Métricas y Validación: TalentMX

## Filosofía Build-Measure-Learn

TalentMX aplica la metodología Lean Startup para validar hipótesis con datos reales antes de escalar. Este documento define las métricas clave, hipótesis a validar y experimentos planeados.

---

## Hipótesis Principales

### Hipótesis 1: Velocidad de Conexión
**Afirmación:** El matching con IA reduce en 75% el tiempo de conexión talento-empresa comparado con métodos tradicionales.

- **Baseline industria:** 30 días promedio (LinkedIn, portales tradicionales)
- **Target TalentMX:** < 7 días (registro → aplicación → entrevista)
- **Métrica:** Mediana de días entre registro y primera entrevista
- **Validación:** Análisis de cohortes semanales durante primer mes
- **Criterio de éxito:** > 70% de usuarios logran entrevista en < 10 días

### Hipótesis 2: Accuracy del Algoritmo
**Afirmación:** El matching basado en TF-IDF + competencias genera > 70% de coincidencias relevantes según validación de empresas.

- **Métrica:** % de matches marcados como "relevante" por reclutadores
- **Target:** > 70% aprobación
- **Validación:** Survey post-match + tracking de perfiles visitados
- **Criterio de éxito:** Empresas contactan al menos 3 de cada 5 matches sugeridos

### Hipótesis 3: Tasa de Conversión
**Afirmación:** Matching inteligente aumenta 40% la tasa de aplicación vs. búsqueda manual.

- **Baseline manual:** ~30% (usuarios ven oferta y aplican)
- **Target TalentMX:** > 40% conversión
- **Métrica:** (Aplicaciones enviadas / Matches mostrados) × 100
- **Validación:** A/B test (50% matching IA, 50% lista sin ordenar)
- **Criterio de éxito:** Diferencia estadísticamente significativa (p < 0.05)

---

## Métricas AARRR (Pirate Metrics)

### 1. Acquisition (Adquisición)
**¿Cómo llegan los usuarios?**

- **Métrica primaria:** Registros nuevos / semana
- **Target MVP:** 50 estudiantes + 10 empresas en primer mes
- **Segmentación:** Por sector (semiconductores, automotriz, aerospace)
- **Canales:** Universidad Rosario Castellanos, ferias empleo, LinkedIn, referidos

**KPIs secundarios:**
- Costo por adquisición (CAC): Target < $5 MXN por estudiante (orgánico)
- Distribución por canal (identificar más efectivo)

### 2. Activation (Activación)
**¿Tienen una primera experiencia exitosa?**

- **Métrica primaria:** % usuarios que completan perfil y ven primer match
- **Target:** > 60% completa perfil en primera sesión
- **Definición de "activado":** 
  - Estudiante: Perfil 80%+ completo + ve 3+ matches
  - Empresa: Publica primera oferta + ve 5+ candidatos

**KPIs secundarios:**
- Tiempo promedio para activación: Target < 10 minutos
- % que abandona en cada paso del onboarding

### 3. Retention (Retención)
**¿Regresan los usuarios?**

- **Métrica primaria:** % usuarios activos semana 2
- **Target:** > 40% retención semanal (W1 → W2)
- **Definición de "activo":** Login + al menos 1 acción (ver matches, aplicar, etc.)

**KPIs secundarios:**
- Retención por cohorte (semanal, mensual)
- Stickiness ratio: DAU/MAU (Target > 0.2)
- Razones de abandono (encuesta exit)

### 4. Referral (Referencias)
**¿Recomiendan la plataforma?**

- **Métrica primaria:** % usuarios que invitan compañeros
- **Target:** > 20% comparte plataforma
- **Mecanismo:** Botón "Invitar compañero" con tracking de referidos

**KPIs secundarios:**
- Viral coefficient (K): Target > 0.5 en mes 3
- NPS (Net Promoter Score): Target > 50

### 5. Revenue (Ingresos)
**¿Están dispuestos a pagar?**

- **Métrica primaria:** % empresas que pagan por premium (post-MVP)
- **Target:** > 15% conversión a pago en mes 3
- **Modelo freemium:** 
  - Gratis: 3 ofertas publicadas, 10 matches/mes
  - Premium: Ofertas ilimitadas, contacto directo, analytics

**KPIs secundarios:**
- Lifetime Value (LTV): Target > $500 MXN/empresa
- LTV:CAC ratio: Target > 3:1

---

## Dashboard de Métricas en Tiempo Real

### Métricas Visibles en UI (para jueces/inversionistas)

**Panel principal muestra:**
1. **Total matches generados** (acumulado desde inicio)
2. **Estudiantes activos** (únicos que han usado matching)
3. **Promedio matches por estudiante** (señal de calidad de algoritmo)
4. **Tasa de aplicación** (aplicaciones / matches × 100)
5. **Sectores más demandados** (gráfico de barras)

**Actualización:** Tiempo real (cada action de usuario)

---

## Experimentos A/B Planeados

### Experimento 1: Ordenamiento de Matches
**Pregunta:** ¿El ordenamiento por score de compatibilidad afecta la tasa de aplicación?

- **Grupo A (Control):** Matches ordenados aleatoriamente
- **Grupo B (Tratamiento):** Matches ordenados por score descendente
- **Duración:** 2 semanas
- **Métrica:** Tasa de aplicación por grupo
- **Hipótesis:** Grupo B tendrá > 30% más aplicaciones

### Experimento 2: Umbral de Compatibilidad
**Pregunta:** ¿Qué umbral mínimo de score maximiza relevancia sin reducir volumen?

- **Variantes:** 30%, 40%, 50%, 60%
- **Duración:** 1 semana por umbral
- **Métricas:** 
  - Cantidad de matches generados
  - % de matches contactados por empresas
- **Hipótesis:** 50% es el sweet spot

### Experimento 3: Notificaciones
**Pregunta:** ¿Las notificaciones de nuevos matches aumentan la retención?

- **Grupo A:** Sin notificaciones email
- **Grupo B:** Email diario con nuevos matches
- **Grupo C:** Email solo si > 70% compatibilidad
- **Métrica:** Retención D7 (day 7)
- **Hipótesis:** Grupo C tendrá mayor retención sin aumentar churn

---

## Implementación Técnica

### Backend: Event Tracking

```python
# Eventos trackeados automáticamente:
- "user_registered" (tipo: estudiante/empresa)
- "profile_completed" (% completitud)
- "match_generated" (student_id, offer_id, score)
- "match_viewed" (quien vio el perfil)
- "application_sent" (student_id, offer_id)
- "application_viewed" (empresa ve aplicación)
- "interview_scheduled" (conversión final)
```

### Frontend: Analytics Dashboard

**Ubicación:** Tab "Métricas" en dashboard principal (`frontend/app.js`)

**Visualizaciones:**
1. Funnel chart: Registros → Activados → Matches → Aplicaciones → Entrevistas
2. Time-series: Usuarios activos (7 días, 30 días)
3. Heatmap: Compatibilidad por sector
4. Top 10: Competencias más demandadas

---

## Criterios de Decisión (Build-Measure-Learn)

### Pivot si:
- Retención W2 < 20% después de 3 iteraciones
- Accuracy del algoritmo < 50% (más bajo que random)
- CAC > LTV (economía de unidad negativa)

### Perseverar si:
- Al menos 2 de 3 hipótesis principales validadas
- Retención W2 > 30%
- Feedback cualitativo positivo (NPS > 40)

### Acelerar si:
- Las 3 hipótesis validadas
- Retención W2 > 50%
- K (viral coefficient) > 0.7
- Demanda orgánica supera capacidad

---

## Roadmap de Validación

### Semana 1-2: MVP Técnico (ACTUAL)
- ✅ API funcional con algoritmo matching
- ✅ Dashboard básico
- 🔄 Sistema de tracking implementado
- 🔄 Documentación de métricas

### Semana 3-4: Validación con Early Adopters
- [ ] Onboarding de 20 estudiantes Universidad Rosario Castellanos
- [ ] Onboarding de 3-5 empresas piloto (1 por sector)
- [ ] Recolección de feedback cualitativo (entrevistas 1-a-1)
- [ ] Ajustes de algoritmo basados en feedback

### Mes 2: Iteración y Optimización
- [ ] Implementar top 3 features solicitadas
- [ ] Ejecutar experimentos A/B
- [ ] Validar hipótesis 1 y 2
- [ ] Documentar learnings en formato "What we learned"

### Mes 3: Preparación para Escala
- [ ] Base de datos PostgreSQL (reemplazar in-memory)
- [ ] Autenticación robusta (JWT)
- [ ] Infraestructura AWS (auto-scaling)
- [ ] Alcanzar métricas target para pitch a inversionistas

---

## Reportes y Transparencia

### Reportes Semanales (Formato Lean Canvas)
1. **Qué construimos:** Features implementadas esta semana
2. **Qué medimos:** Datos de las métricas AARRR
3. **Qué aprendimos:** Insights inesperados, cambios en hipótesis
4. **Próximos experimentos:** Qué vamos a probar la siguiente semana

### Público
- Equipo interno: Reporte semanal completo
- Mentores/Inversionistas: Reporte mensual ejecutivo
- Usuarios: Changelog público con mejoras basadas en feedback

---

## Contacto y Feedback

Para reportar métricas inesperadas o sugerir nuevos experimentos:
- Email: henry@talentmx.com
- GitHub Issues: HenrySpark369/Tlamatini

**Última actualización:** Diciembre 8, 2025  
**Próxima revisión:** Diciembre 15, 2025 (post-onboarding early adopters)
