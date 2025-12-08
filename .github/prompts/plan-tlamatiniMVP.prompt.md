## Plan: MVP Tlamatini Operacional en <1 Hora

**Objetivo:** Completar las 3 tareas críticas para que la plataforma funcione end-to-end con datos reales, demostrando validación de hipótesis Lean Startup.

### Steps

1. **Cargar datos desde CSV en backend** — Modifica `backend/main.py` para leer `data/students.csv` y `data/jobs.csv` al iniciar, reemplazando hardcoding. Valida con Pydantic en `backend/modules/data_models.py`. (~10 min)

2. **Implementar endpoint POST para aplicaciones** — Agrega ruta `POST /candidatos/{estudiante_id}/aplicar/{oferta_id}` en `backend/main.py` con validación, retornando confirmación y compatibilidad calculada. (~10 min)

3. **Conectar frontend con backend real** — Cambia en `frontend/app.js` de MOCK_ENABLED=true a MOCK_ENABLED=false, reemplaza fetch URLs hardcodeadas con backend real, implementa botón "Aplicar" funcional. (~15 min)

4. **Agregar persistencia de aplicaciones** — Mantén lista `aplicaciones_registro` en memoria durante sesión, expón en endpoint `/stats` para validar métrica "Conversión de aplicaciones". (~10 min)

5. **Validar flujo end-to-end** — Prueba: cargar página → ver estudiantes/ofertas de CSV → hacer match → aplicar → ver estadísticas actualizadas. (~10 min)

### Further Considerations

1. **CSV Parsing** — ¿Los archivos `students.csv` y `jobs.csv` contienen columnas necesarias (nombre, competencias, sector)? Recomendación: Leer primeras líneas antes de Step 1.

2. **Persistencia vs. MVP** — ¿Es aceptable perder datos al reiniciar para esta demostración en hackathón? Si no, agregar SQLite (~15 min extra). Recomendación: Mantener en memoria para respetar timeline <1hr.

3. **Auth placeholder** — El login/registro puede quedar como pantalla estática que redirige a dashboard. Autenticación real es post-MVP. Recomendación: Enfocarse en dato + matching, no en seguridad ahora.

### Time Budget

- Step 1: 10 min
- Step 2: 10 min
- Step 3: 15 min
- Step 4: 10 min
- Step 5: 10 min
- **Total: 55 min** (Buffer: 5 min)

### Success Criteria

✅ Frontend carga sin errores
✅ Estudiantes y ofertas cargan desde CSV (no hardcoded)
✅ Matches se calculan correctamente (TF-IDF)
✅ Botón "Aplicar" registra aplicación en backend
✅ `/stats` muestra contadores de aplicaciones
✅ No hay errores 500/404 en logs
