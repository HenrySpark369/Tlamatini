# TalentMX: Plataforma de Vinculación Laboral

## 📋 Ficha Técnica del Producto

### Información General
- **Nombre del producto:** TalentMX
- **Tipo de producto digital:** Web App (Progressive Web Application)
- **Sector estratégico del Plan México:** Desarrollo de Talento y Competitividad Digital

### Objetivos del Plan México que Aborda
1. **Desarrollo de Talento:** Conectar estudiantes/egresados con empleadores en sectores estratégicos
2. **Inversión y Empleo de Alto Valor:** Identificar y conectar talento especializado en manufactura y sectores estratégicos
3. **Digitalización y Competitividad:** Reducir tiempo de matching estudiante-empresa mediante plataforma digital
4. **Proveeduría Nacional:** Conectar PYMES locales con oportunidades de empleo y desarrollo

### Problema u Oportunidad Identificada
En la economía digital mexicana existe una **brecha crítica** entre:
- Estudiantes/egresados de la Universidad Rosario Castellanos sin visibilidad en mercado laboral
- Empresas de sectores estratégicos (automotriz, aeroespacial, semiconductores) que buscan talento especializado
- **Tiempo promedio de vinculación:** 2-3 meses (vs. objetivo nacional de 1 mes)

### Solución Propuesta
**TalentMX** es una plataforma digital que:
- Conecta estudiantes con empleadores mediante matching inteligente
- Visualiza oportunidades en sectores estratégicos del Plan México
- Reduce el tiempo de vinculación mediante algoritmos de compatibilidad
- Facilita registro de competencias y seguimiento de oportunidades

### Resumen Ejecutivo
TalentMX transforma la vinculación laboral tradicional en un proceso digital eficiente. La plataforma conecta talento especializado de la Universidad Rosario Castellanos con empresas de sectores estratégicos mexicanos. Mediante análisis de competencias y oferta de empleo, reduce significativamente el tiempo de matching y acelera la integración de profesionales al mercado laboral. Alineado con los objetivos del Plan México 2024, TalentMX contribuye a formar 150K profesionistas anuales en cadenas de valor estratégicas.

### Público Objetivo y Segmento de Mercado
- **Segmento 1:** Estudiantes/egresados de la Universidad Rosario Castellanos
- **Segmento 2:** Empresas PYMES y medianas (sectores: automotriz, aeroespacial, semiconductores)
- **Mercado digital:** Transformación digital de gestión de talento en México
- **Alcance inicial:** Local (CDMX) → Regional (Zona Metropolitana) → Nacional

### Alcance e Impacto del MVP
- **Alcance:** Local (Universidad Rosario Castellanos y CDMX)
- **Usuarios iniciales:** 500 estudiantes + 50 empresas
- **Impacto esperado:** Reducir tiempo de vinculación en 50% (2-3 meses → 4-6 semanas)

### Análisis de Oportunidad de Mercado
- **Mercado mexicano de talento digital:** ~2.5M estudiantes en educación superior
- **Demanda en sectores estratégicos:** Crecimiento 15% anual (automotriz, semiconductores)
- **Brecha digital:** 85% de gestión de talento sin automatizar en PYMES
- **Potencial TAM:** $150M anuales en servicios de vinculación laboral

### Propuesta de Valor
- **Para estudiantes:** Acceso visible a oportunidades de alto valor, formulario único, seguimiento en tiempo real
- **Para empresas:** Base de talento pre-filtrada, reducción de costos de reclutamiento (40% menos tiempo)
- **Para economía mexicana:** Aceleración de profesionalización en sectores estratégicos

### Ventajas Competitivas
1. **Alineación con Plan México:** Único enfoque explícito en sectores estratégicos
2. **Integración universitaria:** Partnership directo con institución educativa
3. **Solución especializada:** No es LinkedIn genérico, es matching inteligente por sector
4. **MVP ágil:** Implementable en 6 horas, validable en tiempo real

### Tecnologías Utilizadas
- **Backend:** FastAPI (Python), Pydantic
- **Frontend:** HTML5, CSS (Tailwind via CDN), Vanilla JavaScript
- **Base de Datos:** Simulada (en memoria - MVP)
- **Algoritmo:** Matching por similitud de competencias (Scikit-learn)
- **Visualización:** Matplotlib (renderizado backend), Chart.js

### Potencial de Impacto Económico
- **Impacto directo:** 500 estudiantes conectados en 6 semanas
- **Impacto indirecto:** Reducción de 50% en tiempo de contratación = ahorro de $750K anuales (para 50 empresas)
- **Impacto estratégico:** Alineación con Meta 2030 del Plan México (+1.5M empleos de alto valor)

### Modelo de Negocio Digital
- **Revenue Model (Post-MVP):** 
  - B2B2C: Comisión por contratación exitosa (5-10% del salario primer mes)
  - B2B: Suscripción empresas (acceso a talento filtrado)
  - B2C: Premium (estudiantes con mentoría)
- **Escalabilidad:** Replicable a otras universidades mexicanas

### Justificación de Alineación con Plan México
TalentMX aborda **directamente 3 de 6 objetivos** del Plan México:
1. ✅ **Desarrollo de Talento:** Conexión sistemática de 150K profesionistas
2. ✅ **Inversión y Empleo de Alto Valor:** Focus en sectores estratégicos (automotriz, aeroespacial, semiconductores)
3. ✅ **Digitalización y Competitividad:** Reducción de trámites mediante ventanilla digital de oportunidades

---

## 🏗️ Estructura del Proyecto

```
Tlamatini/
├── backend/                 # API FastAPI
│   ├── main.py
│   ├── requirements.txt
│   └── modules/
│       ├── matching.py
│       └── data_models.py
├── frontend/                # Web App
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── data/                    # Datasets & análisis
│   ├── students.csv
│   ├── jobs.csv
│   └── analysis.ipynb
├── docs/                    # Documentación
│   └── PITCH.md
└── README.md
```

---

## 🚀 Inicio Rápido

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
Abrir `frontend/index.html` en navegador (o servir con `python -m http.server 8001`)

### Data Analysis
```bash
jupyter notebook data/analysis.ipynb
```

---

## 📊 Métricas de Éxito del MVP
- [ ] API de matching funcional
- [ ] Dashboard de oportunidades visible
- [ ] Matching accuracy > 70%
- [ ] Tiempo de respuesta < 2s

---

**Última actualización:** Diciembre 8, 2025  
**Estado:** MVP en desarrollo (Hackathón 2024)
