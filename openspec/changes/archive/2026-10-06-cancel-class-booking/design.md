# Design

## Context

El proyecto ya tiene un modelo base de clases, perfil del socio y reservas guardadas en memoria dentro del contexto global. La app ya soporta la vista de próximas clases y la reserva de cupos, por lo que este cambio debe integrarse con el estado actual sin crear una segunda fuente de verdad para la disponibilidad de las clases.

## Goals / Non-Goals

**Goals:**
- Mostrar una pantalla de "Mis reservas" con la lista del socio ordenada desde la más próxima hasta la más lejana.
- Cubrir el estado vacío con el mensaje "Aún no tienes reservas".
- Permitir iniciar la cancelación de una reserva con confirmación previa.
- Aplicar RN-04 con lógica de negocio separada de la UI.
- Liberar el cupo al confirmar una cancelación permitida, sin duplicar información ni inflar el estado.

**Non-Goals:**
- No se añade un backend ni persistencia remota.
- No se implementan notificaciones, historial ni administración de clases.
- No se modifica HU-01 ni HU-02.
- No se introduce una librería de Bottom Sheet si el proyecto no la usa; en ese caso se usará `Modal` nativo de React Native.

## Decisions

- El estado global ya disponible en el contexto se reutilizará para leer `profile`, `classes` y `bookings` del socio autenticado. La vista de "Mis reservas" derivará la colección actual del usuario desde ese estado existente.
- La lista se ordenará por la fecha real de la clase usando la lógica de `diaOffset` ya existente y la misma convención de zona horaria `America/Bogota` para calcular la fecha real. Esto mantiene la consistencia con la reserva y con la disponibilidad de cupos.
- Se añadirá una acción de contexto para cancelar una reserva confirmada y otra para validar si la cancelación es permitida. La validación de RN-04 dependerá de una función pura de dominio, no de lectura directa del componente.
- Cuando la cancelación se autoriza, la reserva se quitará del array de `bookings` del usuario y la clase correspondiente devolverá un cupo disponible. La actualización se hará sobre el mismo estado que ya usa la reserva, evitando otra estructura paralela.
- La confirmación se realizará con un `Modal` nativo de React Native y su contenido estará centrado en la reserva seleccionada, con el texto de confirmación y dos acciones: confirmar o cancelar. Si el proyecto ya tiene un componente de UI de confirmación, se reutilizará; si no, se prioriza `Modal` por no introducir dependencia adicional.
- La lógica de RN-04 se encapsulará en una función de dominio con un criterio explícito: se permite cancelar si el tiempo restante hasta el inicio es mayor o igual a 2 horas; si es menor, la cancelación se rechaza con el mensaje exacto que exige la especificación.
- La vista no decidirá por sí misma si la cancelación es válida: solo dispara la acción del contexto y muestra el mensaje de error o éxito que devuelve la lógica.

## Alternatives Considered

### Alternative 1: Introducir una librería de Bottom Sheet

**Why rejected:**
- El proyecto no demanda una librería extra para este caso.
- Añadir una dependencia adicional aumenta peso y complejidad sin aportar valor claro para un MVP local.
- El `Modal` nativo ya cubre la necesidad de confirmación y cumple con los requisitos observables.

### Alternative 2: Guardar la cancelación en un estado paralelo

**Why rejected:**
- Rompería la fuente de verdad única del contexto.
- Podría crear inconsistencias entre reservas activas y cupos disponibles.
- La lógica de negocio y la UI ya tienen un patrón claro: la lista de reservas y el conteo de cupos deben derivarse del mismo estado global.

### Alternative 3: Validar RN-04 en el componente y no en un helper reutilizable

**Why rejected:**
- Duplicaría reglas de negocio en la pantalla.
- Haría más difícil probar la lógica y evitar regressiones.
- Contradice la convención del proyecto de separar lógica de negocio de UI para facilitar Jest y mantener la solución clara.

## Integration Notes

- La ruta de "Mis reservas" se integrará como una pantalla independiente dentro del flujo de navegación actual de la app.
- La pantalla leerá el usuario autenticado y sus reservas activas desde el contexto; la lista derivará la información visible a partir de la clase asociada.
- La confirmación mostrará la información relevante de la reserva seleccionada y no añadirá comportamiento fuera de la cancelación.
- La acción de cancelación debe ser idempotente desde la perspectiva del usuario: al confirmar una reserva válida, la reserva deja de aparecer y el cupo queda nuevamente disponible para la clase.
