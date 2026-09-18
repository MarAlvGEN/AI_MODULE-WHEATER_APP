# Bug N1 - Inspección y Corrección

## Contexto

Al inspeccionar la aplicación generada por Antigravity (Gemini Flash 3.8 high), detecté que el spinner de carga nunca desaparecía. En lugar de enviar el problema directamente a Antigravity, decidí poner a prueba Nemotron 3 Ultra Free a través de OpenCode en Plan Mode para:

1. Ver si podía reconocer la estructura completa del proyecto sin explicaciones extensas.
2. Verificar cuanto tiempo se tardaría en analizar el proyecto.
3. Confirmar si era capaz de encontrar el error de forma efectiva.
4. Que generara un prompt de solución optimizado para Antigravity.

La idea era darle el menor contexto posible y observar si era capaz de identificar el flujo asíncrono roto.

<img width="958" height="508" alt="image" src="https://github.com/user-attachments/assets/db11188e-37ac-4a81-adba-f2bbc5fda5e0" />

---
## Input (Lo que le dije a Nemotron)

```
Tengo un problema de estado en mi aplicación web vanilla (Weather App). El mensaje/spinner de carga se queda visible permanentemente.

Analiza el flujo de llamadas e identifica por qué no se está ejecutando correctamente lo "esperado" tras completar las peticiones HTTP. Muestra dónde se rompe el flujo asíncrono y explícame qué cambios se requieren en el bloque try...catch...finally o en la manipulación del DOM."

Una vez identificado el problema, genera un prompt para Antigravity con la solución del mismo.
```

---
## Output (Lo que Nemotron me devolvió)

Nemotron realizó las siguientes acciones:

1. Identificó que la llamada automática `handleWeatherSearch('Madrid')` al cargar la app causaba que el loading quedara pegado si fallaba y encontró una mejora en la lógica de las llamadas a funciones auxiliares.
2. Ignoró la "explicación" y pasó directamente a la creación del prompt.
3. Demoró 13min generando toda la respuesta.

Generó el siguiente prompt para Antigravity:

```
Actúa como Desarrollador JS Senior. Mi Weather App presenta un bug crítico: el indicador de carga permanece activo indefinidamente tras hacer una búsqueda/cargar la app.

Necesito que refactorices el código fuente completo de los archivos afectados (`src/js/ui.js`, `src/js/main.js` y `src/js/api.js` si aplica) aplicando estas especificaciones exactas:

el spinner "Obteniendo información del clima..."
queda permanentemente visible antes y después de buscar una ciudad. Nunca se muestra la tarjeta del clima.

El problema está en src/js/main.js. La función handleWeatherSearch llama
a showLoading() y luego hideLoading() en el bloque finally, lo cual debería
funcionar. Sin embargo:

1. En la línea 85 se hace una llamada automática handleWeatherSearch('Madrid')
   al cargar la app. Si esta falla (CORS, red, etc.), el loading queda colgado
   antes de que el usuario pueda hacer nada.

2. No hay protección contra búsquedas superpuestas: si el usuario busca algo
   mientras la búsqueda anterior aún está en curso, se pierde el control del
   estado de carga.

Corrige el bug para que:
- El spinner solo aparezca durante la búsqueda activa y desaparezca siempre
  al terminar (éxito o error).
- Se elimine o mejore la búsqueda automática de 'Madrid' al cargar.
- Se prevengan búsquedas simultáneas (deshabilitar el botón ya se hace en
  showLoading, pero verifica que hideLoading siempre se ejecute correctamente).

Entrégame el código refactorizado y funcional sin omitir ningún fragmento.
```

---
## Resultado

Envié el prompt de Nemotron a Antigravity (Gemini Flash 3.8 high) con los siguientes resultados: 

1. Refactorizó el código y corrigió el bug lógico.
3. Demoró 2min generando toda la respuesta.

<img width="1345" height="706" alt="image" src="https://github.com/user-attachments/assets/4185d66b-f2e3-4311-921b-e56008396591" />
