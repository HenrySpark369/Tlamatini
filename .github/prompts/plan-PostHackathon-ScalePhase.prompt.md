---
name: scale-phase-plan
description: Plan estratégico post-hackathon para escalar Tlamatini como plataforma de empleabilidad tech enfocada en mujeres y mujeres con discapacidad, sin dependencia de patrocinadores ni alianzas institucionales
argument-hint: "[área específica o pregunta estratégica]"
agent: agent
model: claude-sonnet-4-5
tools:
  - semantic_search
  - file_search
  - read_file
  - create_file
  - replace_string_in_file
  - grep_search
  - list_dir
  - run_in_terminal
  - get_errors
---

# Plan: Tlamatini - Fase de Escalamiento Post-Hackathon

## Resumen Ejecutivo

Plataforma de empleabilidad tech enfocada en **mujeres y mujeres con discapacidad** en sectores de **Tecnologías de la Información y Software** (desarrollo de software, ciberseguridad, inteligencia artificial, computación en la nube, big data). Inicio con estudiantes de la **Universidad Nacional Rosario Castellanos** (UNRC) como piloto local, escalando progresivamente a nivel estatal y nacional.

---

## 🎯 Contexto del Proyecto

### Estado Actual
- **MVP Funcional Validado:** Plataforma con matching SVD, dashboards interactivos, API REST completa
- **Tecnología Estable:** Backend FastAPI + Frontend Vanilla JS + Algoritmo SVD para matching avanzado
- **Datos Operativos:** Base de datos expandida (45+ estudiantes, 15+ ofertas) con tracking de aplicaciones

### Nuevo Enfoque Estratégico

#### Público Objetivo Refinado
1. **Mujeres:** Estudiantes y profesionistas en transición al sector tech
2. **Mujeres con Discapacidad:** Accesibilidad como prioridad (WCAG 2.1 AA compliance)
3. **Geográficamente:** Universidad Nacional Rosario Castellanos (CDMX) como piloto, expansión a universidades públicas de la región

#### Sectores Prioritarios (Plan México)
**Tecnologías de la Información y Software:**
- Desarrollo de software (frontend, backend, full-stack)
- Ciberseguridad (ethical hacking, análisis de vulnerabilidades)
- Inteligencia Artificial (ML, NLP, computer vision)
- Computación en la nube (AWS, Azure, GCP DevOps)
- Big Data (análisis de datos, data engineering, BI)

---

## 🛡️ Plan Sin Alianzas Institucionales

### Estrategia Resiliente (Bootstrapped)

Este plan está diseñado para ejecutarse **sin depender de patrocinadores, alianzas universitarias o financiamiento externo** en las primeras fases.

#### A. Adquisición de Usuarias Sin UNRC

**Plan A (Ideal):** Alianza con Universidad Nacional Rosario Castellanos
- Acceso directo a estudiantes
- Validación institucional
- Uso de espacios para talleres

**Plan B (Realista - Sin Alianza):**

| Canal | Táctica | Meta | Costo | Timeline |
|-------|---------|------|-------|----------|
| **Facebook Groups** | Unirse a 10+ grupos (Women in Tech MX, Mujeres Programadoras) + posts orgánicos | 20 usuarias | $0 | Semana 1-2 |
| **LinkedIn** | Posts en #MujeresTech #InclusionDigital + mensajes directos | 15 usuarias | $0 | Semana 1-3 |
| **Bootcamps Alumni** | Contactar Laboratoria, Tecnolochicas, Código Facilito (grupos ex-alumnas) | 10 usuarias | $0 | Semana 2-4 |
| **Meetups Tech** | Asistir a eventos gratuitos (Women Who Code CDMX, PyLadies) + demo rápida | 10 usuarias | $0 | Semana 3-6 |
| **Referidos** | Programa: "Invita 3 amigas = acceso early features" | 15 usuarias | $0 | Semana 4-8 |
| **Reddit/Discord** | Comunidades r/programacion_es, Discord servers tech en español | 5 usuarias | $0 | Continuo |

**Total Proyectado:** 75 usuarias en 8 semanas sin alianzas ($0 CAC)

#### B. Generación de Ofertas Sin Empresas Piloto

**Fase 0 (Semanas 1-4): Contenido Agregado**

```python
# Estrategia: Scraping Ético de Bolsas Públicas
# Fuentes: LinkedIn Jobs, OCC Mundial, Indeed, Computrabajo

1. Filtros de búsqueda:
   - Palabras clave: "junior developer", "analista datos", "QA tester"
   - Modalidad: Remoto, Híbrido CDMX
   - Inclusión: "mujeres", "diversidad", "inclusivo" (en descripción)
   - Sectores: Software, IA, Cloud, Ciberseguridad

2. Agregación manual (2 hrs/semana):
   - Copiar 10-15 ofertas reales/semana
   - Agregar disclaimer: "Oferta de fuente pública - aplica directamente"
   - Link directo a aplicación original

3. Validación comunitaria:
   - Usuarias pueden reportar ofertas caídas/spam
   - Sistema de rating: "¿Aplicaste? ¿Fue real?"
```

**Disclaimer Legal:**
> "Tlamatini agrega ofertas de empleadores públicos. No somos la empresa contratante. Aplicaciones se realizan en sitio del empleador original. Verificamos inclusividad manualmente."

**Fase 1 (Semanas 5-8): Empresas Orgánicas**

```markdown
# Cold Outreach a Startups (100 emails/semana)

**Subject:** "Acceso gratis a 50+ candidatas tech pre-filtradas (mujeres STEM)"

**Body:**
Hola [Nombre Founder],

Vi que [Startup] está contratando [rol]. Tenemos 50+ mujeres desarrolladoras/
analistas buscando oportunidades en tech.

¿Te interesa publicar tu oferta gratis? Solo toma 3 min:
👉 [Link formulario simple]

Beneficios:
- 0 costo (fase beta)
- Candidatas pre-filtradas (skills validados)
- Aumenta tu employer brand en diversidad

Saludos,
[Tu nombre]
Tlamatini - Empleabilidad Tech Inclusiva
```

**Fuentes de Leads:**
- AngelList startups CDMX (500+ startups)
- Startup México directorio
- Twitter: buscar "estamos contratando" + "CDMX"
- LinkedIn: filtrar startups 10-50 empleados

**Meta:** 5-10 empresas publicando orgánicamente en 4 semanas (tasa conversión 5-10%)

#### C. Infraestructura con Presupuesto $0

**Stack Técnico Gratuito (6 Meses):**

| Componente | Herramienta | Plan Gratis | Límite | Cuándo Migrar |
|------------|-------------|-------------|--------|---------------|
| **Backend Hosting** | Railway.app | 500 hrs/mes | ~16hrs/día uptime | >100 usuarias concurrentes |
| **Database** | Supabase | PostgreSQL 500MB | 2GB bandwidth/día | >10K registros |
| **Frontend Hosting** | Vercel | Ilimitado | 100GB bandwidth/mes | Nunca (suficiente) |
| **CDN** | Cloudflare | Ilimitado | Bandwidth ilimitado | Nunca |
| **Error Tracking** | Sentry | 5K eventos/mes | 5K errors | >1K usuarios activos |
| **Analytics** | Google Analytics 4 | Ilimitado | 10M eventos/mes | Nunca |
| **Email Transaccional** | SendGrid | 100 emails/día | 3K/mes | >1K usuarias |
| **Storage Archivos** | Cloudinary | 25 GB/mes | 25K transformaciones | >500 usuarias |
| **Monitoring** | UptimeRobot | 50 monitores | Check cada 5 min | Nunca |

**Costo Total Mensual:** $0
**Capacidad:** Hasta 200-300 usuarias activas sin pagar

**Plan de Migración (Si Crece Más Rápido):**
- Railway → Seenode (planes competitivos)
- Supabase → Supabase Pro ($25/mes)
- **Total con crecimiento:** $50-75/mes para 500-1000 usuarias

#### D. Modelo de Negocio Sin Monetización Temprana

**Filosofía:** No monetizar hasta validar product-market fit

**Fase 0 (Meses 1-3): 100% Gratis**
- Usuarias: Gratis para siempre (core promise)
- Empresas: Publicaciones ilimitadas gratis
- Enfoque: Colocaciones como métrica norte
- Meta: 10 colocaciones demostradas = credibilidad

**Fase 1 (Meses 4-6): Grants Primero**

```markdown
# Calendario de Aplicación a Grants

**Mes 4 (con 10+ colocaciones documentadas):**
- [ ] Google.org Impact Challenge LATAM ($250K-$1M)
      Requisito: Impacto social medible, tech for good
      Deadline: Rolling basis
      
- [ ] ONU Mujeres México - Fondo Igualdad
      Requisito: Empoderamiento económico mujeres
      Monto: $10K-$50K USD
      Deadline: Q2 2026

**Mes 5:**
- [ ] Fundación BBVA - Momentum Project
      Requisito: Emprendimiento social early-stage
      Monto: €10K + mentoría
      
- [ ] BID Lab (Banco Interamericano de Desarrollo)
      Requisito: Innovación + género
      Monto: $50K-$200K

**Mes 6:**
- [ ] Gobierno CDMX - Convocatoria Innovación Social
      Requisito: Impacto local medible
      Monto: $100K-$500K MXN
```

**Requisitos Comunes para Grants:**
1. ✅ 10+ colocaciones documentadas (testimonios + contratos)
2. ✅ Métricas de impacto (% mujeres empleadas, sectores, salarios)
3. ✅ Roadmap claro de escalamiento
4. ✅ Equipo con experiencia tech + social impact
5. ✅ Modelo sostenible a largo plazo

**Fase 2 (Mes 7+): Freemium SOLO si Valida**

**Criterios para activar monetización:**
- ✅ 200+ usuarias activas mensuales
- ✅ 20+ empresas publicando regularmente
- ✅ NPS ≥50 (producto amado)
- ✅ 30+ colocaciones acumuladas
- ❌ NO monetizar antes o riesgo de matar crecimiento

---

## 📊 Análisis de Metodología Ágil

### Evaluación: ¿Lean Startup vs. Alternativas?

#### ✅ Recomendación: **Mantener Lean Startup + Scrum Híbrido**

**Justificación:**

| Criterio | Lean Startup | Scrum Puro | Kanban | Shape Up |
|----------|--------------|------------|--------|----------|
| **Validación continua** | ✅ Excelente | ⚠️ Limitada | ⚠️ Reactiva | ⚠️ Ciclos largos |
| **Pivotes rápidos** | ✅ Core del método | ❌ Resistencia | ✅ Flexible | ⚠️ Apuestas fijas |
| **Product-Market Fit** | ✅ Build-Measure-Learn | ⚠️ Sprints fijos | ⚠️ Sin estructura | ⚠️ Sin métricas |
| **Equipos pequeños** | ✅ Optimizado | ⚠️ Overhead | ✅ Eficiente | ⚠️ Equipos 2-6 |
| **Impacto social medible** | ✅ Métricas Accionables | ❌ Sin enfoque | ❌ Sin enfoque | ❌ Sin enfoque |
| **Adaptación a cambios** | ✅ Pivotes integrados | ⚠️ Sprint planning | ✅ Cambio continuo | ⚠️ 6 semanas fijas |

**Decisión:** Mantener **Lean Startup con elementos de Scrum** para estructura operacional:

1. **Lean Startup (Estrategia):**
   - Hipótesis de valor/crecimiento por fase
   - Ciclos Build-Measure-Learn de 2 semanas
   - Métricas accionables (tasa de registro UNRC, tasa de match exitoso, satisfacción accesibilidad)
   - Validación con usuarios reales (focus groups UNRC)

2. **Scrum (Táctico):**
   - Sprints de 2 semanas alineados con ciclos BML
   - Daily standups asíncronos (Slack/Discord)
   - Sprint reviews = Validación de hipótesis
   - Sprint retrospectives = Aprendizajes documentados

3. **Accesibilidad (Integrado):**
   - Auditorías WCAG cada sprint
   - Testing con usuarios con discapacidad desde semana 1

---

## 🚀 Roadmap de Escalamiento

### Fase 1: Piloto UNRC (Semanas 1-8)

**Objetivo:** Validar product-market fit con 50 usuarias de UNRC + 10 empresas tech locales.

#### Hipótesis de Valor (Actualizada)
> "Mujeres estudiantes de carreras STEM en UNRC enfrentan barreras de género y acceso limitado a oportunidades tech. Una plataforma de matching inteligente con empleadores inclusivos incrementará su empleabilidad en 40% vs. bolsas genéricas."

#### Métricas Accionables
1. **Registro UNRC:** 50 usuarias activas en 4 semanas
2. **Match Calidad:** Promedio de compatibilidad >75% en top 3 recomendaciones
3. **Conversión Aplicación:** 30% de usuarias aplican a ≥2 ofertas
4. **Accesibilidad:** 90% satisfacción en testing con usuarias con discapacidad
5. **Empleabilidad:** 10% colocaciones en primeras 8 semanas (5 estudiantes)

#### Epics Prioritarios

**Epic 1: Registro Inclusivo con Perfil Accesible** (Sprint 1-2)
- [ ] Sistema de registro con validación email UNRC (@alumnos.rosariocastellanos.edu.mx)
- [ ] Formulario de perfil con autocomplete, ARIA labels, navegación por teclado
- [ ] Campos específicos: habilidades tech, certificaciones, discapacidad (opcional), preferencias laborales
- [ ] Onboarding interactivo con tutorial accesible (video con subtítulos + transcripción)
- [ ] Testing con 10 usuarias UNRC (3 con discapacidad visual/motora)

**Epic 2: Integración con Empresas Tech Locales** (Sprint 2-3)
- [ ] Dashboard empresa con filtro género/inclusión
- [ ] API para publicar ofertas con campos: sector tech (IA/cloud/etc), nivel (junior/mid), modalidad (remoto/híbrido)
- [ ] Sello "Empresa Inclusiva" (verificado manualmente)
- [ ] Onboarding de 10 empresas piloto (startups CDMX + corporativos con programas diversidad)

**Epic 3: Matching Optimizado para Inclusión** (Sprint 3-4)
- [ ] Algoritmo SVD ajustado: bias mitigation (evitar sesgos género/discapacidad)
- [ ] Scoring transparente: explicabilidad de por qué un match es recomendado
- [ ] Filtros avanzados: modalidad trabajo, apoyo accesibilidad, políticas género
- [ ] A/B testing: SVD vs. reglas heurísticas vs. híbrido

**Epic 4: Analytics e Impacto Social** (Sprint 4-5)
- [ ] Dashboard impacto: % mujeres colocadas, sectores más activos, tiempo promedio match→entrevista
- [ ] Exportación de reportes para UNRC (cumplir con indicadores institucionales)
- [ ] Visualizaciones accesibles (contraste WCAG AAA, alternativas textuales)
- [ ] Encuestas post-match: NPS, barreras enfrentadas, sugerencias

**Epic 5: Accesibilidad Web Completa** (Transversal Sprint 1-5)
- [ ] Auditoría WCAG 2.1 AA con herramientas automatizadas (axe DevTools, Lighthouse)
- [ ] Testing manual con lectores de pantalla (NVDA, JAWS, VoiceOver)
- [ ] Teclado-only navigation en todos los flujos
- [ ] Contraste de colores conforme WCAG (ratios 4.5:1 texto, 3:1 UI)
- [ ] Documentación de accesibilidad para desarrolladores

#### Validaciones (Fin Sprint 5)
- ✅ 50+ registros UNRC
- ✅ 5+ colocaciones confirmadas
- ✅ NPS ≥40 (promotores - detractores)
- ✅ 0 errores críticos de accesibilidad (WCAG A/AA)
- ⚠️ **Decisión de Pivote si:** <30 registros activos o NPS <20

---

### Fase 2: Expansión Regional CDMX (Semanas 9-16)

**Objetivo:** Escalar a 3 universidades públicas adicionales (UAM, IPN-ESCOM, UNAM-FES Acatlán) + 30 empresas tech.

#### Hipótesis de Crecimiento
> "El modelo UNRC es replicable en universidades públicas de CDMX con estudiantes de perfil similar. Una estrategia de embajadoras (peer-to-peer) generará crecimiento viral con CAC <$5 USD/usuaria."

#### Métricas
1. **Crecimiento Orgánico:** 70% registros por referidos (vs. paid ads)
2. **Activación:** 60% usuarias completan perfil en primera sesión
3. **Retención:** 40% usuarias regresan semanalmente (sticky product)
4. **CAC (Customer Acquisition Cost):** <$5 USD por usuaria activa
5. **LTV (Lifetime Value):** Colocaciones generan $50 USD/usuaria (modelo freemium futuro)

#### Estrategias

**Crecimiento:**
- [ ] Programa de embajadoras en cada universidad (10 estudiantes = incentivo early access features)
- [ ] Talleres presenciales "Rompe Barreras Tech" (50 asistentes/universidad)
- [ ] Contenido educativo: webinars con mujeres líderes tech, guías de ciberseguridad/IA para principiantes
- [ ] Alianzas con grupos estudiantiles (Women in Tech, Chicas en Tecnología)

**Producto:**
- [ ] Módulo de capacitación integrado: cursos cortos (IA 101, Git básico) con certificados
- [ ] Gamificación: insignias por completar perfil, aplicar a ofertas, referir amigas
- [ ] Notificaciones inteligentes: alertas de nuevas ofertas en sectores preferidos

**Infraestructura:**
- [ ] Migrar a PostgreSQL (base de datos actual en memoria no escala)
- [ ] CDN para assets (Cloudflare) - mejorar carga en zonas con internet limitado
- [ ] Monitoreo con Sentry + analytics con Mixpanel (eventos custom: match_viewed, application_sent)

---

### Fase 3: Modelo de Negocio Sostenible (Semanas 17-24)

**Objetivo:** Validar monetización sin afectar misión social.

#### Modelos a Testear (A/B Testing)

**Opción A: Freemium para Empresas**
- Gratis: 3 publicaciones/mes, búsqueda básica
- Premium ($200 USD/mes): publicaciones ilimitadas, acceso prioritario a candidatas top, analytics avanzado
- Enterprise ($500 USD/mes): API access, reclutamiento asistido, sello "Empresa Inclusiva Verificada"

**Opción B: Comisión por Colocación**
- Modelo de éxito: 5% del salario bruto primer mes (pagado por empresa)
- Solo se cobra si hay contratación confirmada
- Sin costo para estudiantes

**Opción C: Grants y Subsidios**
- Aplicar a fondos de impacto social (Gobierno de CDMX, Plan México, ONU Mujeres)
- Modelo 100% gratuito sostenido por grants
- Mayor alineación con misión, pero dependencia de financiamiento externo

#### Métricas de Éxito Fase 3
- **Ingresos:** $2,000 USD MRR (Monthly Recurring Revenue) con ≥10 empresas de pago
- **Margen Operativo:** 40% (costos servidor + desarrollo vs. ingresos)
- **Impacto:** 50+ colocaciones acumuladas en sectores tech prioritarios
- **Sostenibilidad:** Runway de 12 meses sin financiamiento adicional

---

## 🛠️ Backlog Técnico Priorizado

### Sprint 1-2: Fundación Inclusiva
```
- [ ] Rediseño UI con design system accesible (a11y first)
- [ ] Migración a PostgreSQL con schema optimizado
- [ ] CI/CD con GitHub Actions (tests automatizados de accesibilidad)
- [ ] Formulario de registro UNRC con validación
- [ ] Dashboard estudiante v2.0 con matching SVD
```

### Sprint 3-4: Matching Inteligente
```
- [ ] Refinamiento algoritmo SVD (bias detection)
- [ ] Explicabilidad de matches (por qué se recomienda X empresa)
- [ ] Filtros avanzados (modalidad, sector tech específico)
- [ ] Testing A/B de recomendaciones
- [ ] API v2 con paginación y rate limiting
```

### Sprint 5-6: Analytics e Impacto
```
- [ ] Dashboard de impacto social (métricas inclusión)
- [ ] Reportes exportables (PDF/Excel) para UNRC
- [ ] Encuestas post-match NPS
- [ ] Visualizaciones accesibles (gráficos con alternativas textuales)
- [ ] Integración con Google Analytics 4 (eventos custom)
```

---

## 📋 Definición de Done (DoD)

**Para considerar una feature "terminada":**

1. ✅ **Funcionalidad:** Cumple con criterios de aceptación del User Story
2. ✅ **Accesibilidad:** Pasa auditoría WCAG 2.1 AA (0 errores críticos)
3. ✅ **Testing:** Cobertura ≥80% en unit tests + 1 test E2E
4. ✅ **Documentación:** README actualizado + comentarios en código complejo
5. ✅ **Validación:** Testeado con ≥3 usuarias reales (1 con discapacidad si aplica)
6. ✅ **Performance:** Tiempo de carga <3s en conexión 3G
7. ✅ **Deployment:** Desplegado en staging + aprobación en code review

---

## 🧪 Proceso Build-Measure-Learn

### Ciclo de 2 Semanas (Alineado con Sprints)

#### Week 1: Build
- **Lunes:** Sprint planning (seleccionar hipótesis a validar)
- **Martes-Jueves:** Desarrollo iterativo (daily standups)
- **Viernes:** Code freeze + deploy a staging

#### Week 2: Measure + Learn
- **Lunes:** Testing con usuarios (5 usuarias UNRC)
- **Martes:** Análisis de métricas (Mixpanel + analytics custom)
- **Miércoles:** Focus group (20 min feedback sesión)
- **Jueves:** Documentación de aprendizajes + decisión pivote/persevere
- **Viernes:** Sprint retrospective + planning next sprint

### Pivotes Comunes
- **Pivote de Segmento:** Si UNRC no valida, probar con bootcamps tech (Laboratoria, Tecnolochicas)
- **Pivote de Funcionalidad:** Si matching no genera aplicaciones, agregar intro calls automáticas
- **Pivote de Modelo:** Si empresas no pagan, pivotar a grants 100%

---

## 🚨 Criterios de Pivote Temprano

### Red Flags que Indican Cambio de Estrategia

**Pivote de Adquisición (Semana 4):**

| Métrica | Umbral Saludable | Red Flag | Acción |
|---------|------------------|----------|--------|
| Registros totales | ≥20 usuarias | <10 usuarias | Cambiar canales: de LinkedIn a eventos presenciales |
| Tasa activación | ≥60% completan perfil | <30% | Simplificar onboarding (reducir campos) |
| Fuente principal | Diversificada | >70% de 1 canal | Explorar 3 canales adicionales |
| Costo tiempo | <5 hrs/semana | >10 hrs/semana | Automatizar o pivotar a paid ads ($100 test) |

**Pivote de Producto (Semana 8):**

| Métrica | Umbral Saludable | Red Flag | Acción |
|---------|------------------|----------|--------|
| Aplicaciones enviadas | ≥30% usuarias aplican | <10% | Problema de oferta: mejorar calidad/cantidad |
| Tiempo en plataforma | ≥5 min/sesión | <2 min | UX confuso: testing de usabilidad |
| Retención semanal | ≥30% regresan | <10% | Producto no sticky: agregar notificaciones |
| NPS | ≥20 | <0 (más detractores) | **PIVOTE MAYOR:** Entrevistar 10 usuarias |

**Pivote de Modelo (Mes 3):**

| Escenario | Indicador | Decisión |
|-----------|-----------|----------|
| **Crecimiento Lento** | <50 usuarias en 3 meses | Probar nicho más específico (solo IA, solo ciberseguridad) |
| **Sin Colocaciones** | 0 empleos en 3 meses | Cambiar a modelo de capacitación (cursos + certificados) |
| **Alta Deserción** | >60% usuarias inactivas mes 2 | Entrevistar deserción, puede ser problema de oferta |
| **Empresas No Publican** | <5 empresas activas mes 3 | Pivotar a B2C: marketplace de freelancers |

### Señales de "Perseverar" (NO Pivotar)

✅ **Continuar estrategia si:**
- 3+ colocaciones confirmadas (aunque sean pocas, valida hipótesis)
- NPS ≥30 (usuarias contentas, falta escala)
- Crecimiento orgánico >0 (aunque lento, es sostenible)
- Testimonios positivos cualitativos ("cambió mi vida")
- Retención cohorte 1 >40% (early adopters leales)

### Decision Framework (Cada 2 Semanas)

```python
# Matriz de Decisión Build-Measure-Learn

if colocaciones >= 3 and nps >= 20:
    decision = "PERSEVERAR - Acelerar crecimiento"
    accion = "Invertir en marketing (tiempo o $100 ads test)"
    
elif colocaciones >= 1 and nps >= 30:
    decision = "PERSEVERAR - Paciencia, funciona lento"
    accion = "Seguir adquisición orgánica, optimizar conversión"
    
elif colocaciones == 0 and registros < 20 and semanas >= 6:
    decision = "PIVOTE SEGMENTO - Cambiar audiencia"
    accion = "Probar bootcamps o mujeres con experiencia (no estudiantes)"
    
elif aplicaciones / registros < 0.15 and semanas >= 4:
    decision = "PIVOTE PRODUCTO - Ofertas irrelevantes"
    accion = "Mejorar matching o cambiar a otro sector (diseño, marketing)"
    
else:
    decision = "ITERAR - Darle más tiempo"
    accion = "Continuar 2 semanas más, medir de nuevo"
```

### Pivotes Históricos de Startups Similares

**Casos de Éxito:**

1. **Laboratoria (Perú/México):**
   - **Pivote Original:** Bootcamp genérico → Bootcamp solo mujeres
   - **Resultado:** Enfoque claro, grants de género, $3M+ funding

2. **Turing (UK):**
   - **Pivote Original:** Freelance marketplace → Remote jobs para LATAM devs
   - **Resultado:** $87M funding, 200K+ desarrolladores

3. **Glints (Southeast Asia):**
   - **Pivote Original:** LinkedIn para estudiantes → Job matching con AI
   - **Resultado:** Series C $50M, 4M+ usuarios

**Aprendizaje Clave:** Todos pivotaron 1-3 veces antes de product-market fit. Fallo es parte del proceso.

---

## 🎯 Criterios de Éxito Post-Hackathon (6 Meses)

| Métrica | Meta Conservadora | Meta Ambiciosa | Actual |
|---------|-------------------|----------------|--------|
| **Usuarias Activas** | 200 mujeres | 500 mujeres | - |
| **Empresas Piloto** | 20 empresas | 50 empresas | - |
| **Colocaciones Confirmadas** | 20 empleos | 50 empleos | - |
| **NPS (Net Promoter Score)** | ≥40 | ≥60 | - |
| **Accesibilidad WCAG** | AA (0 críticos) | AAA (aspiracional) | - |
| **Ingresos (si monetización)** | $1,500 USD MRR | $5,000 USD MRR | - |
| **Reconocimiento** | 1 premio/mención | Alianza gobierno | - |

---

## 📞 Stakeholders Clave

### Aliados Estratégicos (Deseables, No Críticos)

**Tier 1 (Alta Prioridad - Buscar Activamente):**
1. **UNRC:** Coordinación académica, acceso a estudiantes, validación institucional  
   *Alternativa:* Reclutamiento directo vía comunidades online
2. **Empresas Tech CDMX:** Publicación de ofertas, feedback de calidad de candidatas  
   *Alternativa:* Scraping ético + cold outreach (100 emails/semana)

**Tier 2 (Media Prioridad - Oportunista):**
3. **Organizaciones Inclusión:** Chicas en Tecnología, Women Who Code CDMX, Fundación Éntrale  
   *Valor:* Credibilidad, acceso a comunidades, posibles eventos conjuntos  
   *Sin ellos:* Seguimos con crecimiento orgánico

**Tier 3 (Baja Prioridad - Solo Si Vienen a Nosotros):**
4. **Plan México / Gobierno:** Alineación con sectores prioritarios, posible financiamiento  
   *Valor:* Grants grandes, PR, institucionalidad  
   *Sin ellos:* Bootstrapped es suficiente para validar

### Comunicación

**Con Aliados (Si Existen):**
- **Weekly Updates:** Email a coordinadores UNRC/organizaciones (viernes)
- **Monthly Demos:** Video demo de nuevas features (último viernes del mes)
- **Quarterly Impact Report:** Métricas de impacto social (PDF ejecutivo)

**Sin Aliados (Plan Default):**
- **Community Updates:** Posts semanales en redes sociales (resultados, testimonios)
- **Newsletter Mensual:** A usuarias registradas (nuevas features, casos de éxito)
- **Reportes Públicos:** Blog posts trimestrales con métricas transparentes (credibilidad)

---

## 🔄 Siguiente Acción Inmediata

**PRIORIDAD 1 (Esta Semana):**
1. [ ] **Plan A:** Contactar UNRC para presentar propuesta  
   **Plan B (si no responden en 48hrs):** Iniciar adquisición orgánica (Facebook Groups + LinkedIn)
2. [ ] Rediseñar homepage con enfoque mujeres + accesibilidad
3. [ ] Auditoría WCAG inicial (axe DevTools) - identificar gaps críticos
4. [ ] Definir User Stories Sprint 1 (registro general + perfil accesible)
5. [ ] Setup infraestructura gratuita: Railway + Supabase + Vercel

**PRIORIDAD 2 (Próximas 2 Semanas):**
1. [ ] Migración PostgreSQL/Supabase (schema + migración datos actuales)
2. [ ] Implementar Epic 1 (Registro Inclusivo sin restricción email)
3. [ ] **Plan A:** Reclutar 10 usuarias piloto UNRC  
   **Plan B:** Reclutar 10 usuarias de comunidades online (Women Who Code, Laboratoria alumni)
4. [ ] **Plan A:** Onboarding 5 empresas tech  
   **Plan B:** Agregar 15 ofertas de scraping ético (LinkedIn/OCC) + disclaimer
5. [ ] Programa de referidos: "Invita 3 amigas = early access" (growth hack $0)

---

## 📚 Recursos de Referencia

### Documentación Interna
- [PITCH.md](../../docs/PITCH.md) - Presentación original (mantener para historia)
- [METRICAS.md](../../docs/METRICAS.md) - Framework de medición
- [README_SVD_IMPLEMENTATION.md](../../README_SVD_IMPLEMENTATION.md) - Algoritmo de matching
- Workspace: `${workspaceFolder}`

### Accesibilidad
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Inclusive Design Principles](https://inclusivedesignprinciples.org/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

### Lean Startup
- "The Lean Startup" - Eric Ries
- "Running Lean" - Ash Maurya
- "Sprint" - Jake Knapp (Google Ventures)

---

## 🏁 Conclusión

Este plan marca la transición de **prototipo validado** a **producto escalable con impacto social medible**. La combinación de Lean Startup (estrategia de validación) + Scrum (ejecución disciplinada) + enfoque de accesibilidad desde diseño garantiza que construyamos una solución robusta y ética.

**Filosofía:** Cada línea de código debe acercarnos a más mujeres empleadas en tech. Si una feature no contribuye a esta misión, no va en el sprint.

---

## 📖 Cómo Usar Este Prompt

**En VS Code Chat:**
1. Escribe `/scale-phase-plan` en el chat de GitHub Copilot
2. Agrega contexto adicional si es necesario (ej: `/scale-phase-plan crear epic 1 sprint 1`)
3. El agente usará este plan como guía para decisiones estratégicas

**Desde el Editor:**
1. Abre este archivo `.prompt.md`
2. Presiona el botón ▶️ en la barra de título
3. Elige ejecutar en sesión actual o nueva

**Variables Disponibles:**
- `${workspaceFolder}` - Ruta raíz del proyecto Tlamatini
- `${file}` - Archivo actualmente abierto
- `${selection}` - Texto seleccionado en el editor

---

*Última actualización: 23 de diciembre de 2025*  
*Versión: 1.1 (Post-Hackathon Scale Phase - VS Code Prompt File Format)*
