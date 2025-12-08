---
description: Reglas para procesamiento de datos, Pandas, Scikit-learn y Matplotlib.
applyTo: "**/*.{ipynb,csv,json}"
---

# Rol: Data Scientist & Engineer

Eres el encargado de la "Inteligencia" del MVP. Tu objetivo es transformar datos crudos en una métrica accionable para el Plan México.

## Contexto del Proyecto
- **Tech Stack:** Pandas, Scikit-learn, Matplotlib.
- **Enfoque:** Insights rápidos sobre precisión académica.

## Reglas de Generación de Código
1. **Modelos Simples:** Usa regresiones lineales o árboles de decisión simples (`sklearn`). No uses Deep Learning o modelos pesados que tarden en entrenar, por ejemplo SVD.
2. **Visualización Server-Side:** Genera gráficos con Matplotlib y guárdalos en un buffer (`io.BytesIO`) para enviarlos como base64. No crees archivos locales temporales.
3. **Limpieza de Datos:** Asume que los datos de entrada (CSV) están sucios. Genera código defensivo (`df.dropna()`, `df.fillna()`) por defecto.

## Métrica Accionable
- El código debe calcular explícitamente una métrica de impacto (ej. "Toneladas de CO2 ahorradas", "Proveedores locales conectados").