# Bitácora de uso de IA

## Herramientas que usé
- Copilot, VS Code

## Prompts clave (3 a 5)
| # | Fase               | Prompt   | Qué obtuve                                |
|---|--------------------|----------|-------------------------------------------|
| 1 | Setup              | NA       | Proyecto creado                           |
| 2 | Agendar clase      | P1, P2   | Archivos creados con sus especificaciones |
| 3 | Ver las reservas   | P3, P4   | Archivos creados con sus especificaciones |
| 4 |                    |          |                                           |
| 5 | Bitácora           |          |                                           |

## Errores de la IA que detecté
| # | Qué hizo mal                                        | Cómo lo detecté                                                          | Cómo lo resolví                               |
|---|-----------------------------------------------------|--------------------------------------------------------------------------|-----------------------------------------------|
| 1 | Error de TS                                         | Revisando el codigo generado por el agente.                              | Le pedi al agente corregirlo (era facil)      |
| 2 | No renderizaba las clases reservadas por el usuario | El metodo `getUserReservations` tenía un filter que tenia esa validación | Solo mostraba clases cuyo inicio no ha pasado |

## Resultado de `openspec validate`
- Fase 2:
```
openspec validate
✔ What would you like to validate? All (changes + specs)
✓ change/add-class-booking
Totals: 1 passed, 0 failed (1 items)
```
- Fase 3:
```
✔ What would you like to validate? All (changes + specs)
✓ change/cancel-class-booking
✓ spec/class-booking
Totals: 2 passed, 0 failed (2 items)
```

## Prompts

### P1.
Vamos a comenzar la Fase 2 utilizando OpenSpec.

Fase 2:
Proposal, spec, design y tasks
3. Crea un cambio (sugerido: `add-class-booking`) a partir del insumo.
4. `proposal.md` con **Why, What Changes e Impact**.
5. Spec delta (sugerido: `specs/class-booking/spec.md`). **Cada regla RN-01 a RN-04 debe estar cubierta por un requisito con escenarios.**
6. `design.md` breve (usa `plantillas/design.md`): estructura, manejo de estado, cómo calculas las fechas y una alternativa que descartaste.
7. `tasks.md` con el plan en pasos pequeños.
8. `openspec validate` sin errores.

El change actual es:

add-class-booking

Antes de realizar cualquier cambio, lee y utiliza como contexto:

openspec/project.md

Insumo: /insumo_funcional_ClaseFit.md

La estructura y metadata existente en openspec/changes/add-class-booking/

Quiero trabajar siguiendo el workflow spec-driven de OpenSpec.

A partir del insumo funcional, desarrolla el change completo antes de implementar código:

Proposal: documenta por qué se realiza el cambio, qué se va a modificar y cuál será su impacto.

Specification: transforma el insumo funcional en requisitos formales de OpenSpec. Debe cubrir las funcionalidades del MVP y explícitamente las reglas RN-01, RN-02, RN-03 y RN-04 mediante escenarios verificables.

Design: define las decisiones técnicas necesarias para implementar la solución, respetando las restricciones de openspec/project.md. Incluye estructura, manejo del estado, cálculo de fechas/disponibilidad y la separación de la lógica de negocio de la UI.

Tasks: divide la implementación en tareas pequeñas, ordenadas y verificables.

No implementes código de la aplicación todavía.

No inventes funcionalidades fuera del alcance del insumo.

Antes de terminar, verifica que la propuesta, especificación, diseño y tareas sean consistentes entre sí y que la implementación futura pueda derivarse de estos artefactos.


### P2.
Implementa la HU-02: "Reservar una clase" del change `add-class-booking`.

Antes de modificar código, lee:

- `openspec/project.md`
- `openspec/changes/add-class-booking/specs/`
- `openspec/changes/add-class-booking/design.md`
- `openspec/changes/add-class-booking/tasks.md`
- `insumo-funcional/insumo_funcional_ClaseFit.md`

Revisa también la implementación existente de HU-01 y reutiliza las estructuras, tipos, estado y componentes que correspondan. No dupliques lógica que ya exista.

### Alcance

Implementa únicamente las tareas de `tasks.md` correspondientes a HU-02 y sus dependencias necesarias.

HU-02 debe permitir que Laura reserve una clase desde la pantalla de próximas clases.

Debe respetar las siguientes reglas de negocio:

- RN-01: no se puede reservar una clase sin cupos. Mostrar: "Esta clase ya no tiene cupos."
- RN-02: no se puede reservar dos veces la misma clase. Mostrar: "Ya reservaste esta clase."
- RN-03: Laura puede tener como máximo 2 reservas para el mismo día. Mostrar: "Solo puedes reservar 2 clases por día."

Cuando una reserva sea exitosa:

- La reserva debe agregarse al estado de reservas de Laura.
- El cupo disponible debe disminuir en 1.
- Debe mostrarse: "¡Listo! Tu cupo está reservado".

### Restricciones

- Respeta `design.md` y `project.md`.
- Mantén la lógica de negocio separada de la UI.
- No agregues backend, networking ni persistencia.
- No implementes HU-03 ni la cancelación.
- No introduzcas librerías de estado adicionales.
- No cambies la estructura existente sin necesidad.
- No modifiques la spec para adaptar la implementación; la implementación debe cumplir la spec.

### Tests

Implementa los tests correspondientes a los escenarios de RN-01, RN-02 y RN-03.

Los tests de las reglas de negocio deben ser independientes de los componentes de UI siempre que sea posible.

Ejecuta los tests después de implementar.

Al finalizar:

1. Revisa el diff completo.
2. Ejecuta todos los tests relevantes.
3. Corrige los errores introducidos por esta HU.
4. Marca en `tasks.md` únicamente las tareas de HU-02 que realmente estén terminadas y verificadas.
5. No marques tareas de HU-03 como completadas.


### P3
Vamos a planificar el nuevo change `cancel-class-booking` utilizando el workflow `spec-driven` de OpenSpec.

El change `add-class-booking` ya fue implementado y archivado. Este nuevo change debe partir del estado actual del proyecto y de las specs actuales. No modifiques ni reabras el change archivado.

Lee primero:

- `openspec/project.md`
- Las specs actuales en `openspec/specs/`
- `insumo-funcional/insumo_funcional_ClaseFit.md`

También revisa la implementación actual únicamente para entender el comportamiento y las estructuras que ya existen para las reservas. No modifiques código de la aplicación.

### Objetivo del change

Planificar exclusivamente la HU-03: "Ver y cancelar mis reservas".

La funcionalidad requerida es:

- El socio puede acceder a "Mis reservas".
- Puede ver sus reservas ordenadas desde la más próxima hasta la más lejana.
- Si no tiene reservas, debe mostrarse: "Aún no tienes reservas".
- Puede iniciar la cancelación de una reserva.
- Antes de cancelar se debe solicitar confirmación.
- Para la confirmación de la cancelación podemos usar el Bottom Sheet de la libreria de expo ui.
- Si confirma y la cancelación está permitida, la reserva desaparece y el cupo de la clase se libera.
- Debe aplicarse RN-04.

### RN-04

La cancelación está permitida si faltan 2 horas o más para el inicio de la clase.

Si faltan menos de 2 horas, no se puede cancelar y debe mostrarse exactamente:

"Ya no puedes cancelar: faltan menos de 2 horas."

Considera explícitamente el límite:

- exactamente 2 horas antes → permitido;
- menos de 2 horas → rechazado.

### Qué debes producir

Completa únicamente los artefactos de planificación del nuevo change:

1. `proposal.md`
   - Explica por qué se necesita este cambio.
   - Describe qué capacidad nueva se incorpora.
   - Indica el impacto del cambio.

2. `specs/`
   - Crea el delta de especificación correspondiente a la funcionalidad de cancelación.
   - Cubre la visualización de reservas, ordenamiento, estado vacío, confirmación, cancelación y liberación del cupo.
   - Cubre RN-04 mediante requisitos y escenarios verificables.
   - Mantén la especificación centrada en comportamiento observable.
   - No copies las specs completas de `add-class-booking`; este change debe describir únicamente lo nuevo.

3. `design.md`
   - Describe cómo se integrará la nueva funcionalidad con el estado de reservas existente.
   - Describe la nueva ruta/pantalla de "Mis reservas".
   - Describe cómo se mostrará la confirmación de cancelación.
   - Considera un bottom sheet para la confirmación.
   - Si no existe una librería de bottom sheets, evalúa utilizar el `Modal` nativo de React Native en lugar de introducir una dependencia únicamente para esta funcionalidad.
   - Describe cómo se aplicará RN-04 separando la lógica de negocio de la UI.
   - Describe cómo se reutilizará la lógica existente para calcular la fecha real de las clases.
   - Describe cómo la cancelación hará que el cupo vuelva a estar disponible sin crear una segunda fuente de verdad.
   - Incluye las alternativas relevantes descartadas y por qué.

4. `tasks.md`
   - Divide la implementación de HU-03 en tareas pequeñas y verificables.
   - Ordena las tareas según sus dependencias.
   - Incluye las tareas necesarias para la pantalla/ruta, listado, ordenamiento, empty state, confirmación, cancelación, RN-04 y tests.
   - Las tareas deben ser suficientemente concretas para implementarlas posteriormente, pero no implementes nada ahora.

### Restricciones

Respeta completamente `openspec/project.md` y las specs actuales.

No:

- implementes código de la aplicación;
- modifiques HU-01 o HU-02;
- modifiques `add-class-booking`;
- agregues backend;
- agregues funcionalidades fuera de HU-03;
- introduzcas decisiones técnicas que contradigan `project.md`.

No agregues detalles de implementación a `spec.md` que deberían pertenecer a `design.md`.

### Validación

Cuando hayas terminado los cuatro artefactos:

- revisa que proposal, specs, design y tasks sean coherentes entre sí;
- verifica que RN-04 tenga escenarios suficientes, incluyendo exactamente 2 horas y menos de 2 horas;
- verifica que las tareas cubran todos los requisitos definidos;
- ejecuta `openspec validate cancel-class-booking`;
- si la validación falla, corrige los artefactos y vuelve a validar.

No implementes ninguna tarea todavía. La siguiente fase será implementar este change después de revisar los artefactos.


## P4
# Implementación — HU-03: Ver y cancelar mis reservas

Implementa la HU-03: “Ver y cancelar mis reservas” del change `cancel-class-booking`, siguiendo este plan y respetando estrictamente el alcance definido en los artefactos de OpenSpec.

## Objetivo

Desarrollar únicamente la funcionalidad de ver y cancelar reservas del socio autenticado, sin ampliar el alcance de HU-01 y HU-02.

## Requisitos funcionales

- El socio puede acceder a la pantalla **“Mis reservas”**.
- Se muestran sus reservas activas ordenadas desde la más próxima hasta la más lejana.
- Si no tiene reservas, debe mostrarse exactamente:
  **“Aún no tienes reservas”.**
- El usuario puede iniciar la cancelación de cualquiera de sus reservas.
- Antes de cancelar se debe solicitar confirmación.
- Para la confirmación de la cancelación, usar Bottom Sheet de la librería de Expo UI o, si no existe instalada, usar `Modal` nativo de React Native.
- Si confirma y la cancelación está permitida, la reserva desaparece y el cupo de la clase se libera.
- Debe aplicarse RN-04:
  - exactamente 2 horas antes → permitido;
  - menos de 2 horas → rechazado.
- Mensaje exacto si no está permitido:
  **“Ya no puedes cancelar: faltan menos de 2 horas.”**

## Restricciones

- No implementes ninguna funcionalidad fuera de HU-03.
- No modifiques HU-01 ni HU-02.
- No reabras ni toques el change archivado `add-class-booking`.
- No agregues backend ni servicios externos.
- Respeta el stack y arquitectura del proyecto descrita en `project.md`
- Mantén la lógica de negocio separada de la UI.
- Reutiliza la lógica existente para calcular la fecha real de las clases (`diaOffset` y zona horaria).
- Mantén una sola fuente de verdad para reservas y cupos.
- No agregues dependencias nuevas si no son estrictamente necesarias.

## Alcance técnico recomendado

- Reutiliza el estado global existente del contexto de reservas y clases.
- Añade la pantalla o ruta **“Mis reservas”** con la lista de reservas del usuario.
- Define la lógica de cancelación en utilidades reutilizables y con pruebas.
- La UI solo debe invocar la acción y mostrar mensajes.
- Cuando la cancelación sea válida, elimina la reserva del estado del usuario y devuelve el cupo a la clase correspondiente.
- Si la cancelación no corresponde a RN-04, no se debe borrar la reserva y se debe mostrar el mensaje exacto.

## Criterios de aceptación

- La pantalla muestra reservas activas ordenadas cronológicamente.
- El empty state funciona cuando no hay reservas.
- La confirmación se muestra antes de ejecutar la cancelación.
- La cancelación permitida libera cupo.
- La cancelación no permitida conserva la reserva y muestra el mensaje exacto.
- Las pruebas de negocio cubren RN-04 y la lógica de ordenamiento/cancelación.
- No se introducen decisiones técnicas incompatibles con `project.md`.

## Validación final

Cuando termines:

1. Ejecuta las pruebas relevantes con Jest.
2. Ejecuta:

   ```bash
   openspec validate cancel-class-booking