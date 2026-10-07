# Tasks

## 1. Definición de la lógica de reservas del usuario

- [x] 1.1 Definir el selector de reservas activas del socio ordenadas desde la más próxima hasta la más lejana.
- [x] 1.2 Definir la lógica que calcula si una reserva puede cancelarse según RN-04, incluyendo el caso límite de exactamente 2 horas y el caso de menos de 2 horas.
- [x] 1.3 Definir la operación de cancelación que elimina la reserva del estado y restaura el cupo disponible sin duplicar la fuente de verdad.
- [x] 1.4 Añadir pruebas unitarias para la ordenación, el estado vacío, la confirmación de cancelación y RN-04 con los escenarios de exactamente 2 horas y menos de 2 horas.

## 2. Estado y flujo de cancelación

- [x] 2.1 Extender el contexto existente para exponer la lista de reservas del socio y la acción de cancelación con mensajes observables.
- [x] 2.2 Definir la acción interna que valida RN-04 antes de confirmar una reserva y devuelve el mensaje correcto si la cancelación no está permitida.
- [x] 2.3 Encapsular la liberación del cupo para que el cálculo de disponibilidad siga dependiendo del mismo estado global actual.

## 3. Pantalla de "Mis reservas"

- [x] 3.1 Crear la ruta o pantalla de "Mis reservas" y conectarla con el contexto del usuario.
- [x] 3.2 Mostrar la lista ordenada de reservas con la información mínima necesaria para identificar la clase y su horario.
- [x] 3.3 Implementar el estado vacío con el texto exactamente "Aún no tienes reservas" cuando no haya reservas activas.
- [x] 3.4 Añadir la acción de iniciar la cancelación desde la reserva seleccionada.

## 4. Confirmación y cancelación

- [x] 4.1 Diseñar y mostrar la confirmación antes de cancelar una reserva, preferiblemente con un `Modal` nativo o el componente disponible del proyecto.
- [x] 4.2 Implementar la confirmación de cancelar y la acción de cierre del diálogo sin romper el flujo de la pantalla.
- [x] 4.3 Al confirmar una cancelación permitida, quitar la reserva de la lista y liberar el cupo correspondiente.
- [x] 4.4 Si la cancelación no está permitida, mantener la reserva visible y mostrar exactamente "Ya no puedes cancelar: faltan menos de 2 horas.".

## 5. Verificación final y coherencia del cambio

- [x] 5.1 Validar que la pantalla, la lógica y los tests del cambio sean coherentes con la historia HU-03.
- [x] 5.2 Ejecutar la validación del change con `openspec validate cancel-class-booking` y corregir cualquier desalineación antes de pasar a la implementación final.
