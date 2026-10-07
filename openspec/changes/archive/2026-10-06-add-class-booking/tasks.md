# Tasks

## 0. Vista de próximas clases

- [x] 0.1 Definir el listado de clases próximas para hoy, mañana y pasado mañana, ordenadas por fecha y hora, y excluir las clases ya empezadas.
- [x] 0.2 Mostrar nombre, día, hora, instructor y cupos disponibles; si no quedan cupos, mostrar "Llena" y bloquear la reserva.
- [x] 0.3 Verificar la coherencia entre la vista, el estado global del contexto y los datos iniciales de mock-data para la historia HU-01.

## 1. Definición de la lógica de reserva

- [x] 1.1 Definir las utilidades puras para disponibilidad, duplicado y límite de dos reservas por día. Verificar que las funciones reciben fechas controladas y no dependen del reloj real del sistema.
- [x] 1.2 Añadir pruebas unitarias para RN-01, RN-02 y RN-03 con casos positivos y negativos. Verificar que la suite de negocio pasa con Jest.

## 2. Estado global y flujo de reserva

- [x] 2.1 Crear el estado global para clases, perfil del usuario y reservas actuales del socio, con la estructura base del contexto de React y los datos iniciales de `mock-data/clases.json`.
- [x] 2.2 Implementar la lógica de `bookClass` para validar cupos, duplicados y límite diario antes de confirmar la reserva. Verificar que el mensaje de éxito o error coincida con la spec y que la reserva quede guardada dentro del estado global del usuario.

## 3. UI y verificación del MVP

- [x] 3.1 Construir la vista de clases con el botón de reserva y el estado "Llena" cuando el cupo sea 0. Verificar que la acción no se ejecuta si alguna regla falla.
- [x] 3.2 Ejecutar la validación final del change con `openspec validate` y confirmar que la propuesta, la spec, el diseño y las tareas son coherentes entre sí.
