# class-booking Specification

## Purpose
Permite al socio reservar una clase disponible sin exceder la capacidad ni duplicar reservas, mostrando mensajes claros cuando no se puede completar la operación.

## Requirements

### Requirement: A user can view upcoming classes
The system SHALL show only classes scheduled for today, tomorrow, or the day after tomorrow, ordered by date and time, excluding classes that have already started. Each class card SHALL display the class name, day, time, instructor, and either the available capacity or "Llena" when no seats remain.

#### Scenario: upcoming classes are listed with availability
- **WHEN** the user opens the classes screen
- **THEN** the system shows only upcoming classes for the next three days, ordered by date and time, and excludes classes that have already started
- **AND** each class shows the name, day, time, instructor, and remaining capacity or a "Llena" state

### Requirement: A valid class booking can be created
The system SHALL create a booking for a selected class when the class has remaining capacity, the user has not already booked it, and the user has not reached the daily booking limit.

#### Scenario: successful booking
- **WHEN** the user reserves a class with available seats and no duplicate or daily limit violation
- **THEN** the system records the booking, reduces the available seats by one, and shows "¡Listo! Tu cupo está reservado"

### Requirement: RN-01 sold-out classes cannot be booked
The system SHALL reject a booking when no seats remain and SHALL show "Esta clase ya no tiene cupos."

#### Scenario: sold-out class is rejected
- **WHEN** the user attempts to reserve a class whose remaining capacity is 0
- **THEN** no booking is created and the message "Esta clase ya no tiene cupos." is displayed

### Requirement: RN-02 duplicate reservation on the same class is rejected
The system SHALL reject a second reservation for the same class within the user's bookings and SHALL show "Ya reservaste esta clase."

#### Scenario: same class cannot be booked twice
- **WHEN** the user already has a booking for a class and tries to reserve it again
- **THEN** no second booking is created and the message "Ya reservaste esta clase." is displayed

### Requirement: RN-03 maximum two classes per day is enforced
The system SHALL reject a booking when the user already has two bookings scheduled for the same date and SHALL show "Solo puedes reservar 2 clases por día."

#### Scenario: daily booking limit is enforced
- **WHEN** the user already has two bookings on the same day and tries to reserve another class on that date
- **THEN** no booking is created and the message "Solo puedes reservar 2 clases por día." is displayed

### Requirement: RN-04 cancellation is only allowed before the two-hour cutoff
The system SHALL reject a cancellation request when the class starts in less than two hours and SHALL show "Ya no puedes cancelar: faltan menos de 2 horas."

#### Scenario: cancellation after the cutoff is rejected
- **WHEN** the user attempts to cancel a reservation with less than two hours remaining before the class start time
- **THEN** the reservation remains active and the message "Ya no puedes cancelar: faltan menos de 2 horas." is displayed

### Requirement: A user can view their reservations
The system SHALL show the user's active reservations in chronological order from the nearest upcoming class to the farthest one.

#### Scenario: reservations are listed from nearest to farthest
- **WHEN** the user opens the "Mis reservas" screen
- **THEN** the system displays only the active reservations for the current user
- **AND** the list is sorted from the nearest upcoming reservation to the farthest one

### Requirement: Empty state is shown when there are no reservations
The system SHALL show "Aún no tienes reservas" when the user has no active reservations.

#### Scenario: empty state is displayed
- **WHEN** the user opens "Mis reservas" and has no active reservations
- **THEN** the system shows the message "Aún no tienes reservas"

### Requirement: A user can initiate cancellation for a reservation
The system SHALL allow the user to start the cancellation flow for any reservation that is shown in the list.

#### Scenario: cancellation is initiated from the reservation card
- **WHEN** the user selects a reservation to cancel
- **THEN** the system opens a confirmation step before completing the action

### Requirement: Cancellation requires confirmation
The system SHALL require the user to confirm the cancellation before removing the reservation.

#### Scenario: user confirms cancellation
- **WHEN** the user confirms the cancellation of a valid reservation
- **THEN** the reservation is removed from the active list and the class capacity is released

#### Scenario: user cancels the confirmation action
- **WHEN** the user closes the confirmation dialog without confirming
- **THEN** the reservation remains active and no cancellation is performed

### Requirement: RN-04 allows cancellation only with at least two hours remaining
The system SHALL allow a cancellation when the class starts in exactly two hours or later and SHALL reject a cancellation when the class starts in less than two hours.

#### Scenario: cancellation is allowed exactly two hours before class start
- **WHEN** the user confirms cancellation of a reservation for a class that starts exactly 2 hours from now
- **THEN** the reservation is removed and the class capacity is released

#### Scenario: cancellation is rejected when there are less than two hours remaining
- **WHEN** the user attempts to cancel a reservation for a class that starts in less than 2 hours
- **THEN** the reservation remains active and the system shows "Ya no puedes cancelar: faltan menos de 2 horas."

### Requirement: A valid cancellation releases class capacity
The system SHALL release the occupied seat when a cancellation is confirmed and allowed.

#### Scenario: confirmed cancellation frees one seat
- **WHEN** a reservation is cancelled successfully
- **THEN** the class becomes available again by one seat and the reservation disappears from the current user's list
