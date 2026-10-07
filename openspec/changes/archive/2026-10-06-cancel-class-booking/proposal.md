# Proposal

## Why

Laura necesita ver y gestionar sus reservas desde la app para evitar dejar cupos ocupados sin usar y para poder cancelar cuando ya no pueda asistir. El flujo actual cubre la vista de clases y la reserva, pero no ofrece una pantalla dedicada a las reservas activas ni un mecanismo claro de cancelación con confirmación y validación de regla RN-04.

## What Changes

- Añadir una pantalla o ruta de "Mis reservas" para que el socio consulte sus reservas activas.
- Mostrar la lista de reservas ordenada desde la más próxima hasta la más lejana.
- Mostrar un estado vacío con el mensaje "Aún no tienes reservas" cuando no haya reservas activas.
- Permitir iniciar una cancelación desde la tarjeta de la reserva.
- Solicitar confirmación antes de confirmar la eliminación de la reserva.
- Usar un bottom sheet para la confirmación, o un `Modal` nativo si no se introduce una dependencia extra.
- Aplicar RN-04 para permitir cancelaciones solo cuando faltan 2 horas o más antes del inicio de la clase.
- Si la cancelación no está permitida, mostrar exactamente "Ya no puedes cancelar: faltan menos de 2 horas." y conservar la reserva activa.
- Cuando la cancelación esté permitida, retirar la reserva y liberar el cupo de la clase sin duplicar ninguna fuente de verdad.

## Capabilities

### New Capabilities

- `view_user_reservations`: listar las reservas activas del socio con orden cronológico y estado vacío.
- `cancel_reservation`: confirmar y ejecutar la cancelación de una reserva validando la regla RN-04.

## Impact

- El cambio afecta el contexto existente de clases y reservas del usuario en la app.
- Reutiliza la estructura actual del estado global para mantener la fuente de verdad única en el contexto y las clases del mock local.
- Requiere una separación clara entre la lógica de negocio y la UI: la validación de RN-04 debe resolverse con funciones reutilizables y deterministas, mientras la pantalla se limita a invocarlas y mostrar mensajes.
- No introduce backend ni dependencias adicionales; la confirmación se realizará con el mecanismo nativo disponible en React Native si no hay una librería ya instalada.
- La funcionalidad queda acotada a la huella de HU-03: ver reservas y cancelarlas, sin ampliar el alcance a otras historias del MVP.
