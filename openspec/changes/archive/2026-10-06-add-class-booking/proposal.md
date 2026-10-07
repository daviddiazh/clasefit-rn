# Proposal

## Why

Laura necesita reservar una clase desde el celular para asegurar su cupo sin depender de WhatsApp ni generar sobrecupos. El MVP requiere un flujo local y claro de reserva con validaciones inmediatas para evitar errores de disponibilidad y duplicidad.

## What Changes

- Permitir ver las próximas clases del socio (hoy, mañana y pasado mañana), ordenadas por fecha y hora, con información de cupos y estado "Llena" cuando no haya disponibilidad.
- Añadir el flujo de reserva de una clase disponible desde la vista de clases del gimnasio.
- Validar que la clase tenga cupos antes de registrar la reserva.
- Impedir reservar la misma clase dos veces para el mismo socio.
- Impedir más de dos reservas en el mismo día.
- Mostrar el mensaje de éxito o de error correspondiente según la regla que falle.
- La cancelación no forma parte del slice actual; RN-04 queda documentada como regla de negocio del producto y como referencia para un cambio posterior.

## Capabilities

### New Capabilities

- `view_upcoming_classes`: listado de clases próximas para que el socio pueda elegir a cuál asistir.
- `class-booking`: flujo de reserva de clases para un socio autenticado localmente en el MVP.

## Impact

- Afecta el estado global de clases y reservas dentro del contexto de React Native.
- Requiere lógica reutilizable para validar disponibilidad, duplicados y el límite por día antes de confirmar la compra del cupo.
- No introduce backend, autenticación ni servicios externos; el MVP sigue siendo frontend-only con datos locales.
- La implementación y las pruebas se enfocarán en la reserva como comportamiento principal del cambio.
