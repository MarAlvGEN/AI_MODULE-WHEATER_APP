# Bug N2 - Corrección Manual

**Problema**: La tarjeta del clima queda muy pegada al borde superior del header.

**Herramientas**: DevTools (identificación), Vite (visualización en tiempo real)

**Decisión**: Corrección manual directa. No valía la pena gastar tokens en algo tan simple.

---

## Contexto

Usé Vite para visualizar la web en tiempo real y ver cómo iba trabajando Antigravity. Una vez corregido el bug lógico (Bug N1), revisé la interfaz y noté que la card del clima quedaba muy pegada al header.

---

## Corrección

1. **Identificación**: Usé las herramientas de desarrollador del navegador (DevTools) para inspeccionar la card y confirmar que el problema era un `margin-top` faltante.

2. **Edición**: Abrí `assets/css/styles.css` y agregué la regla:

```css
.weather-card {
  margin-top: 2rem;
}
```