# Bitácora de uso de IA

## Herramientas que usé
-

## Prompts clave (3 a 5)
| # | Fase               | Prompt | Qué obtuve      |
|---|--------------------|--------|-----------------|
| 1 | Setup              | NA     | Proyecto creado |
| 2 | Agendar clase      | P1     |                 |

## Errores de la IA que detecté
| # | Qué hizo mal | Cómo lo detecté | Cómo lo resolví |
|---|---|---|---|
| 1 | | | |

## Resultado de `openspec validate`
```
(pega aquí la salida)
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