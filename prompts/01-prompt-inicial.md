# Prompt Inicial - Weather App

**Motor:** Antigravity (Gemini Flash 3.8 high)
**Objetivo:** Generar el proyecto completo de la Weather App

**Modelos utilizados en esta fase:**
- **Gemini Flash 3.6** - Estructuró requisitos y ordenó prompts
- **MiMo 2.5 Free** - Definió estructura de carpetas y sugirió estilos

---
## Prompt inicial
```
Actúa como un Desarrollador Web Senior y genera un proyecto completo, modular y listo para producción de una Aplicación del Clima interactiva (Weather App) utilizando únicamente tecnologías Web Vanilla (HTML5, CSS3 y JavaScript ES6+ sin frameworks ni bundling tools).

---

### 1. Requerimientos Funcionales y Tecnológicos
- **Pila Tecnológica:** HTML5 semántico, CSS3 moderno (Flexbox/Grid, variables CSS, animaciones fluidas) y JavaScript Vanilla puro.
- **API Meteorológica:** Integra la API gratuita de Open-Meteo (sin API Key).
  - *Nota de Integración:* Debe implementar primero la Geocoding API de Open-Meteo (`https://geocoding-api.open-meteo.com/v1/search?name=CIUDAD`) para convertir el nombre de la ciudad ingresada por el usuario en coordenadas (latitud y longitud), y luego consultar la API del clima (`https://api.open-meteo.com/v1/forecast?latitude=LAT&longitude=LON&current_weather=true`).
- **Entrada de usuario:** Un input de texto donde se escribe el nombre de una ciudad y un botón de búsqueda. Soporte para buscar presionando la tecla 'Enter'.
- **Visualización de Datos:** Mostrar en una tarjeta (card) moderna la ciudad encontrada, la temperatura actual (°C), la velocidad del viento (km/h) y el estado del tiempo codificado de forma amigable (ej. Despejado, Nublado, Lluvia).
- **Manejo de Estados:**
  - Mostrar un indicador visual de carga (Spinner/Loading) durante las peticiones HTTP.
  - Gestión clara de errores (ciudad no encontrada, falla de red, input vacío).

---

### 2. Estructura de Carpetas Sugerida
Genera el código exacto dividiendo la lógica en la siguiente estructura modular:

weather-app/
├── index.html
├── assets/
│   └── css/
│       └── styles.css
└── src/
    ├── js/
    │   ├── api.js         # Funciones para llamadas HTTP a Open-Meteo (Geocoding y Weather API)
    │   ├── ui.js          # Manipulación del DOM, renderizado de datos y mensajes de error
    │   └── main.js        # Punto de entrada, escucha de eventos (listeners) y flujo principal
    └── README.md          # Documentación básica de uso

---

### 3. Especificaciones del Código

1. **index.html:**
   - Estructura limpia y semántica (`<header>`, `<main>`, `<section>`, `<footer>`, ect).
   - Importación de los estilos CSS y los scripts JS como módulos (`type="module"`) o cargados en el orden correcto.

2. **assets/css/styles.css:**
   - Diseño moderno, limpio y responsive (Mobile-First).
   - Uso de variables CSS para colores (gradientes neutros o temáticos), tipografía y sombras.
   - Micro-interacciones (hover en botones, transiciones en las cards).

3. **src/js/api.js:**
   - Exporta funciones asíncronas (`async/await`) utilizando `fetch()`.
   - Manejo estricto de `try/catch` para capturar fallos de red o respuestas HTTP que no sean `ok`.

4. **src/js/ui.js:**
   - Funciones puras para actualizar la interfaz: `renderWeather(data)`, `showLoading()`, `hideLoading()`, `showError(message)`.

5. **src/js/main.js:**
   - Coordina el envío del formulario, valida el input, llama a las funciones de `api.js` y delega la renderización a `ui.js`.

---

Por favor, genera el código fuente completo de todos los archivos (`index.html`, `styles.css`, `api.js`, `ui.js`, `main.js` y `README.md`) sin omitir líneas ni usar comentarios tipo "// coloca tu código aquí". Todo debe funcionar de inmediato al abrir el index.html en el navegador.
```

## Output

Antigravity generó todos los archivos solicitados directamente en mi computador. Luego de la inspección se determinó que la aplicación quedó con 1 bug lógico y 1 bug visual.
