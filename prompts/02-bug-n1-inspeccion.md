# Bug N1 - Inspección y Corrección

**Problema**: El spinner de carga permanece visible permanentemente antes y después de buscar una ciudad.

**Objetivo**: Probar la capacidad de Nemotron (OpenCode) para diagnosticar un problema con el mínimo contexto posible.

---

## Contexto

Al inspeccionar la aplicación generada por Antigravity, detecté que el spinner de carga nunca desaparecía. En lugar de enviar el problema directamente a Antigravity, decidí probar Nemotron Ultra a través de OpenCode en Plan Mode para:

1. Ver si podía reconocer la estructura completa del proyecto sin explicaciones extensas
2. Que generara un prompt de solución optimizado para Antigravity

La idea era darle el menor contexto posible y observar si era capaz de identificar el flujo asíncrono roto.

---

## Input (Lo que le dije a Nemotron)

```
"Tengo un problema de estado en mi aplicación web vanilla (Weather App). El mensaje/spinner de carga ('Obteniendo información del clima...') se queda visible permanentemente.

Analiza el flujo de llamadas e identifica por qué no se está ejecutando correctamente lo "esperado" tras completar las peticiones HTTP. Muestra dónde se rompe el flujo asíncrono y explícame qué cambios se requieren en el bloque try...catch...finally o en la manipulación del DOM."

Una vez identificado el problema, genera un prompt para Antigravity con la solución del mismo.
```

---

## Output (Lo que Nemotron me devolvió)

Nemotron identificó correctamente los problemas:

1. La llamada automática `handleWeatherSearch('Madrid')` al cargar la app causaba que el loading quedara pegado si fallaba
2. No había protección contra búsquedas simultáneas

Generó el siguiente prompt para Antigravity:

```
Actúa como Desarrollador JS Senior. Mi Weather App presenta un bug crítico: el indicador de carga permanece activo indefinidamente tras hacer una búsqueda.

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

Envié el prompt de Nemotron a Antigravity. Este refactorizó el código y corrigió el bug lógico correctamente.

![Nemotron Ultra dandolo todo XD](assets/demo/Pasted image 20260917151410.png)
