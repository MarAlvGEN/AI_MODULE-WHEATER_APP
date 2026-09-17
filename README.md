# Weather App (Vanilla Web)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Open-Meteo](https://img.shields.io/badge/Open--Meteo-API-00A8E8?style=flat)
![License](https://img.shields.io/badge/License-MIT-green)

Aplicación interactiva para la consulta del pronóstico meteorológico en tiempo real, desarrollada con tecnologías web vanilla. Impulsada por la API pública y gratuita de [Open-Meteo](https://open-meteo.com/).

---

## El Experimento

El objetivo era generar una aplicación web completa utilizando **la menor cantidad de prompts posible y casi cero interacción humana sobre el código**. El flujo fue:

<img width="1348" height="731" alt="image" src="https://github.com/user-attachments/assets/1dbe6fbb-0f62-4610-b02a-f0a23187f8ff" />


1. **Construcción del prompt**: Usé Gemini y MiMo (a través de OpenCode en Plan Mode) para definir requisitos, estructura de carpetas y especificaciones técnicas. El resultado fue un único prompt optimizado para Antigravity.

2. **Generación con Antigravity**: Envié el prompt a Antigravity, que generó la aplicación completa en **solo 2 prompts**.

3. **Inspección y corrección de bugs**: Tras revisar el código, encontré 2 bugs. Cada uno se trató de forma diferente para hacer uso de las distintas funcionalidades de la IA.

---

## Modelos Utilizados

| Modelo                  | Rol             | Qué hizo                                            |
| ----------------------- | --------------- | --------------------------------------------------- |
| **MiMo (OpenCode)**     | Apoyo           | Definió la estructura de carpetas y sugirió estilos |
| **Gemini**              | Apoyo           | Estructuró los requisitos y ordenó los prompts      |
| **Nemotron (OpenCode)** | Apoyo           | Identificó y diagnosticó el Bug N1                  |
| **Antigravity**         | Motor principal | Generó la aplicación y corrigió el Bug N1           |

**Herramientas complementarias:**
- **Vite** - Servidor de desarrollo para visualizar la web en tiempo real
- **Firefox DevTools** - Inspección del DOM y CSS en el navegador.
- **nvim** - Editor de código.

---

## Prompt Inicial

El prompt completo que se envió a Antigravity para generar la aplicación:

Ver: [prompts/01-prompt-inicial.md](prompts/01-prompt-inicial.md)

---

## Bugs Encontrados

### Bug N1 - Spinner de carga permanece visible (Lógico)

**Problema**: El spinner de carga no desaparecía después de buscar una ciudad, ni siquiera mostraba errores.

**Qué hice**: Usé Nemotron Ultra a través de OpenCode en Plan Mode para inspeccionar el código con el mínimo contexto posible. El objetivo era probar si el modelo podía reconocer la estructura completa del proyecto sin explicaciones extensas. Nemotron identificó el problema y generó un prompt de solución para Antigravity.

**Resultado**: Antigravity corrigió el bug lógico refactorizando el manejo de estados asíncronos.

Ver prompt de inspección y solución: [prompts/02-bug-n1-inspeccion.md](prompts/02-bug-n1-inspeccion.md)

---

### Bug N2 - Espaciado de la card (Visual)

**Problema**: La tarjeta del clima quedaba muy pegada al borde superior del header.

**Qué hice**: Corrección manual directa en el CSS. No valía la pena gastar tokens en algo tan simple cuando el núcleo de la aplicación estaba terminado.

**Resultado**: Agregué `margin-top: 2rem` a la card para un espaciado correcto.

Ver detalle: [prompts/03-bug-n2-correccion-manual.md](prompts/03-bug-n2-correccion-manual.md)

<img width="841" height="437" alt="image" src="https://github.com/user-attachments/assets/eeefae4f-489d-4a61-8975-2132d3c75083" />
Benchmark de inteligencias artificiales

---

## Resultado Final

La aplicación resultante cumple con todos los requisitos: búsqueda de ciudades, visualización del clima en tiempo real, manejo de estados y diseño responsive.

![Weather App - Resultado Final](assets/demo/Pasted image 20260917154110.png)
