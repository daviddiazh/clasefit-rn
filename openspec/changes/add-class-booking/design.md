# Design

## Context

Este cambio se desarrolla en un MVP frontend-only con React Native, datos locales y estado global gestionado con Context API. La motivación está descrita en proposal.md: Laura necesita reservar una clase desde la app sin depender de WhatsApp ni de un backend.

## Goals / Non-Goals

**Goals:**
- Permitir reservar una clase disponible con feedback inmediato.
- Validar las reglas RN-01, RN-02 y RN-03 antes de confirmar el cupo.
- Mantener la lógica de negocio separada de la UI para facilitar tests.

**Non-Goals:**
- No se añade cancelación de reservas ni historial de reservas.
- No se introduce autenticación, pagos ni administración de clases.
- No se consideran notificaciones, backend ni sincronización con otros usuarios.

## Decisions

- Se mantendrá la estructura principal en `src/context`, `src/utils`, `src/hooks`, `src/types` y componentes de pantalla. El estado global quedará en un contexto con el perfil del usuario (`Laura Gómez`, id del socio) y las reservas confirmadas actuales del socio.
- La lógica de dominio se encapsulará en funciones puras bajo `src/utils/classBooking.ts`, con validaciones para capacidad disponible, clase ya reservada y límite máximo de dos reservas por día. Ese módulo usará los datos del perfil y la lista de reservas actuales como parte del contexto, sin mezclar UI con lógica.
- El cálculo de la disponibilidad se hará sobre la capacidad base de la clase y las reservas ya confirmadas del socio, usando `diaOffset` y la zona horaria `America/Bogota` para determinar el día real de la clase.
- La capa de UI solo manejará el evento de reservar y mostrará el mensaje de éxito o error; no debería decidir la regla de negocio directamente.
- La opción de validar la regla de negocio dentro de cada componente fue descartada porque duplicaría lógica y haría más frágil el flujo. Una función reutilizable y pura es más fácil de probar con Jest.

## Risks / Trade-offs

- [Estado en memoria] → Si se reinicia la app, las reservas pueden perderse; este MVP no exige persistencia real y la validación puede centrarse en la lógica de negocio.
- [Dependencia de la zona horaria local] → La lógica debe tratar `America/Bogota` como referencia para evitar inconsistencia entre fechas y horarios.
- [Disponibilidad local] → El sistema no refleja reservas reales de otros usuarios; el MVP asume que `ocupados` y las reservas del socio son la fuente de verdad.
