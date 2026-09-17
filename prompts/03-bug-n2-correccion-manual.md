# Bug N2 - Correcciones Manuales

**Problema**: La tarjeta del clima queda muy pegada al header y falta el footer.

**Herramientas**: DevTools (identificación), Vite (visualización en tiempo real), nvim (edición)

**Decisión**: Correcciones manuales directas. No valía la pena gastar tokens en algo tan simple.

**Tiempo total**: ~3 min

---

## Contexto

Usé Vite para visualizar la web en tiempo real y ver cómo iba trabajando Antigravity. Una vez corregido el bug lógico (Bug N1), revisé la interfaz y noté dos problemas visuales:

1. La card del clima quedaba muy pegada al header
2. Faltaba el footer de la aplicación

---

## Correcciones

### 1. Espaciado de la card

**Identificación**: Usé las herramientas de desarrollador del navegador (DevTools) para inspeccionar la card y confirmar que el problema era un `margin-top` faltante.

**Edición**: Abrí `assets/css/styles.css` con nvim y agregué la regla:

```css
.weather-card {
  margin-top: 2rem;
}
```

### 2. Footer

**Identificación**: Noté que Antigravity no había generado footer en la estructura HTML.

**Edición**: Abrí `index.html` con nvim y agregué el footer:

```html
<footer class="footer">
  <p>Weather App &copy; 2026 - Desarrollada con IA</p>
</footer>
```

Luego agregué los estilos en `assets/css/styles.css`:

```css
.footer {
  text-align: center;
  padding: 1.5rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.875rem;
  opacity: 0.7;
}
```

---

## Lección Aprendida

No todo requiere IA. Los cambios de estilos simples (márgenes, paddings, colores) y la adición de elementos básicos (footer) son más rápidos de hacer manualmente que de documentar y enviar como prompt.
