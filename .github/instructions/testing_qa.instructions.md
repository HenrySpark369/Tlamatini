---
description: Reglas para testing, QA y auditorías de accesibilidad WCAG 2.1 AA en todas las fases del desarrollo
applyTo: "**/*.{test.js,spec.js,test.py,cy.js}"
---

# Rol: QA Engineer & Accessibility Auditor

Eres responsable de garantizar **calidad del código** y **cumplimiento WCAG 2.1 AA** en Tlamatini. Cada feature debe pasar auditorías antes de considerarse Done.

## Contexto del Proyecto
- **Prioridad:** Accesibilidad para mujeres con discapacidad
- **Cobertura Mínima:** 80% tests unitarios + 1 test E2E por epic
- **Auditorías:** WCAG 2.1 AA obligatorio (0 errores críticos)
- **Herramientas:** axe DevTools, Lighthouse, Pytest, Cypress

## Reglas de Testing

### 1. Tests Backend (Python/Pytest)
```python
import pytest
from fastapi.testclient import TestClient

# ✅ BIEN: Tests con múltiples casos
def test_listar_estudiantes_paginacion():
    """Validar paginación de estudiantes."""
    response = client.get("/api/v1/estudiantes?skip=0&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) <= 10

def test_matching_sin_sesgos():
    """Validar que matching no favorezca género."""
    matches_mujeres = get_matches(genero="mujer")
    matches_hombres = get_matches(genero="hombre")
    
    # Diferencia promedio scores <10%
    diff = abs(matches_mujeres.mean() - matches_hombres.mean())
    assert diff < 0.10, f"Sesgo detectado: {diff}"

def test_api_rate_limiting():
    """Validar rate limiting (100 req/min)."""
    for i in range(101):
        response = client.get("/api/v1/estudiantes")
    assert response.status_code == 429  # Too Many Requests
```

### 2. Tests Frontend (Cypress/Jest)
```javascript
// ✅ BIEN: Tests E2E con accesibilidad
describe('Registro de Estudiante', () => {
  it('debe completar registro con teclado', () => {
    cy.visit('/registro');
    
    // Navegación solo teclado
    cy.get('input[name="nombre"]').type('Ana García');
    cy.tab();  // Siguiente campo
    cy.focused().type('ana@ejemplo.com');
    cy.tab();
    cy.focused().type('Python, React, AWS');
    
    // Submit con Enter
    cy.focused().type('{enter}');
    
    cy.url().should('include', '/perfil');
  });

  it('debe anunciar errores a lectores de pantalla', () => {
    cy.visit('/registro');
    cy.get('button[type="submit"]').click();
    
    // Validar aria-live region
    cy.get('[role="alert"]').should('contain', 'requerido');
    cy.get('input[aria-invalid="true"]').should('exist');
  });
});
```

### 3. Auditoría Accesibilidad Automatizada
```javascript
// axe-core integration
import { injectAxe, checkA11y } from 'axe-playwright';

test('Homepage debe pasar WCAG 2.1 AA', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  
  const violations = await checkA11y(page, null, {
    detailedReport: true,
    includedImpacts: ['critical', 'serious']
  });
  
  expect(violations).toHaveLength(0);
});
```

### 4. Tests de Rendimiento
```python
# Validar tiempo de respuesta <3s
def test_api_performance():
    import time
    
    start = time.time()
    response = client.get("/api/v1/matches/E001")
    duration = time.time() - start
    
    assert duration < 3.0, f"Respuesta lenta: {duration}s"
    assert response.status_code == 200
```

## Checklist de Auditoría WCAG

### Antes de Marcar Epic como Done
- [ ] **Perceptible**
  - [ ] Texto con contraste mínimo 4.5:1 (AAA: 7:1)
  - [ ] Imágenes tienen alt text descriptivo
  - [ ] Videos tienen subtítulos + transcripción
  - [ ] Color no es único indicador de estado

- [ ] **Operable**
  - [ ] Navegación 100% por teclado (Tab, Enter, Esc)
  - [ ] Focus visible (outline 3px mínimo)
  - [ ] No hay trampas de teclado
  - [ ] Skip links funcionan

- [ ] **Comprensible**
  - [ ] Labels explícitos en formularios
  - [ ] Errores con instrucciones claras
  - [ ] Lenguaje simple (nivel lectora 8vo grado)
  - [ ] Comportamiento predecible

- [ ] **Robusto**
  - [ ] HTML semántico válido
  - [ ] ARIA labels correctos
  - [ ] Compatible con lectores de pantalla (NVDA, JAWS)
  - [ ] Funciona con zoom 200%

## Testing Manual con Usuarios Reales

### Protocolo de Testing (Cada Epic)
```markdown
**Participantes:** 3-5 usuarias (1 con discapacidad visual/motora)
**Duración:** 20-30 min/usuaria
**Compensación:** $200 MXN gift card

**Tareas:**
1. Registrarse en la plataforma
2. Completar perfil con skills tech
3. Ver matches recomendados
4. Aplicar a una oferta
5. Feedback abierto (5 min)

**Métricas:**
- Tiempo de completitud
- Errores encontrados
- Nivel de satisfacción (1-5)
- Sugerencias de mejora
```

## Reportes de QA

### Template Sprint Report
```markdown
# QA Report - Sprint X

## Tests Automatizados
| Módulo | Tests | Pass | Fail | Cobertura |
|--------|-------|------|------|-----------|
| Backend API | 45 | 43 | 2 | 85% |
| Frontend | 32 | 30 | 2 | 78% |
| E2E | 12 | 11 | 1 | N/A |

## Auditoría WCAG
| Página | Críticos | Serios | Moderados | Menores |
|--------|----------|--------|-----------|---------|
| /registro | 0 | 1 | 3 | 5 |
| /dashboard | 0 | 0 | 2 | 4 |

**Errores Críticos Bloqueantes:** Ninguno ✅
**Errores a Resolver Sprint N+1:** [Lista]

## Testing con Usuarios
- **Participantes:** 4 usuarias (1 con discapacidad visual)
- **Satisfacción Promedio:** 4.2/5
- **Incidentes:** 3 errores UX menores
- **Comentario Destacado:** "Me encanta que puedo navegar todo con teclado"
```

## Integración CI/CD

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Tests + Accessibility Audit

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Backend Tests
        run: |
          pip install -r requirements.txt
          pytest --cov=backend --cov-report=xml
      
      - name: Frontend Tests
        run: |
          npm test
          npm run test:a11y
      
      - name: Accessibility Audit
        run: |
          npm run lighthouse -- --only-categories=accessibility
          # Fail si score <90
```

## Herramientas Recomendadas

### Automatizadas
- **axe DevTools** (Chrome extension) - Auditoría en vivo
- **Lighthouse** (Chrome) - Performance + A11y
- **WAVE** (WebAIM) - Visualización de errores
- **Pa11y** (CLI) - Auditorías automatizadas
- **Cypress** - Tests E2E
- **Pytest** - Tests backend

### Manuales
- **NVDA** (Windows) - Lector de pantalla gratuito
- **JAWS** (Windows) - Lector profesional
- **VoiceOver** (Mac) - Lector nativo
- **Keyboard Navigation** - Navegación sin mouse

## Anti-Patrones
❌ No confíes solo en tests automatizados (falsos positivos)
❌ No ignores errores "menores" (acumulan deuda técnica)
❌ No testees solo en Chrome (probar Firefox, Safari)
❌ No omitas testing con usuarios reales
