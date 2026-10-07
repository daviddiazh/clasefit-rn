# class-booking Specification

## Purpose

Permite al socio consultar sus reservas activas y cancelarlas cuando la regla de negocio lo autoriza, manteniendo la disponibilidad real de cada clase y mostrando mensajes claros cuando la cancelación no está permitida.

## ADDED Requirements

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
