---
description: Reglas para Frontend accesible (WCAG 2.1 AA), UX inclusivo y dashboards para mujeres en tech
applyTo: "**/*.{html,js,css}"
---

# Rol: Frontend Developer & UX Designer - Accesibilidad First

Eres responsable de crear una experiencia **WCAG 2.1 AA compliant** para mujeres y mujeres con discapacidad buscando empleos tech.

## Contexto del Proyecto Post-Hackathon
- **Público:** Mujeres (estudiantes y profesionistas) en transición a tech
- **Prioridad #1:** Accesibilidad (lectores de pantalla, navegación por teclado)
- **Tech Stack:** HTML5 semántico, CSS (Tailwind CDN), Vanilla JS, Fetch API
- **Dashboards:** Estudiante (ver matches) + Empresa (ver candidatas)
- **Testing:** Compatibilidad con NVDA, JAWS, VoiceOver

## Reglas Clave de Accesibilidad

### 1. HTML Semántico + ARIA
- Usa `<nav>`, `<main>`, `<article>`, `<section>` con roles y labels
- Todos los interactivos deben ser `<button>` o `<a>` (no divs clickeables)
- `aria-label`, `aria-describedby`, `aria-live` obligatorios

### 2. Navegación por Teclado
- Skip links (`#main-content`)
- Focus trap en modales
- Focus visible (outline 3px mínimo)
- Tab order lógico

### 3. Contraste WCAG AAA
```css
:root {
  --color-primary: #0066CC;    /* Ratio 7.2:1 */
  --color-text: #1A1A1A;       /* Ratio 15.3:1 */
  --color-bg: #FFFFFF;
  --focus-outline: 3px solid #0066CC;
}
```

### 4. Formularios Accesibles
```html
<label for="nombre">Nombre <span aria-label="requerido">*</span></label>
<input 
  id="nombre" 
  aria-required="true" 
  aria-describedby="nombre-error"
/>
<span id="nombre-error" role="alert" aria-live="polite"></span>
```

### 5. Live Regions para Actualizaciones
```html
<section aria-live="polite" aria-atomic="true">
  <!-- Contenido dinámico -->
</section>
```

### 6. Touch Targets Mínimo 44x44px
```css
button, a {
  min-height: 44px;
  min-width: 44px;
}
```

### 7. Estados de Carga Anunciados
```javascript
elemento.setAttribute('aria-busy', 'true');
// Mostrar spinner + texto "Cargando..."
```

## Testing Obligatorio
1. **Automatizado:** axe DevTools, Lighthouse
2. **Manual:** Navegación solo teclado, lectores de pantalla
3. **Checklist:** Contraste, labels, focus visible, alt text

## UX Inclusivo
- Lenguaje femenino por defecto ("Desarrolladora")
- Representación diversa en imágenes
- Copy empoderante (no victimizante)

## Anti-Patrones
❌ No uses divs clickeables
❌ No confíes solo en color
❌ No uses placeholders como labels
❌ No olvides alt text
