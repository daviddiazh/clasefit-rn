import {
  bookClass,
  cancelClassBooking,
  getClassDateKey,
  getRemainingCapacity,
  getUserReservations,
} from './classBooking';
import type { ClassItem, Booking } from '../types/classBooking';

const USER_ID = 'S-0001';
const OTHER_USER_ID = 'S-0002';
const BASE_DATE = new Date('2026-10-06T10:00:00');
const BASE_DATE_EARLY = new Date('2026-10-06T08:00:00');

const FULL_CLASS_MESSAGE = 'Esta clase ya no tiene cupos.';
const DUPLICATE_BOOKING_MESSAGE = 'Ya reservaste esta clase.';
const SAME_DAY_LIMIT_MESSAGE = 'Solo puedes reservar 2 clases por día.';
const SUCCESS_BOOKING_MESSAGE = '¡Listo! Tu cupo está reservado';
const SUCCESS_CANCEL_MESSAGE = 'Reserva cancelada correctamente.';
const CANCEL_DEADLINE_MESSAGE = 'Ya no puedes cancelar: faltan menos de 2 horas.';

const baseClass: ClassItem = {
  id: 'C-02',
  nombre: 'Funcional',
  instructor: 'Camila Ospina',
  diaOffset: 0,
  hora: '18:00',
  duracionMin: 60,
  cupoTotal: 15,
  ocupados: 9,
};

describe('class booking rules', () => {
  it('RN-01 rejects booking when class is full', () => {
    const classItem: ClassItem = { ...baseClass, cupoTotal: 10, ocupados: 10 };
    const result = bookClass({
      classItem,
      bookings: [],
      userId: USER_ID,
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe(FULL_CLASS_MESSAGE);
  });

  it('RN-02 rejects duplicate reservation on the same class', () => {
    const bookings: Booking[] = [{ classId: baseClass.id, userId: USER_ID, dateKey: getClassDateKey(baseClass) }];

    const result = bookClass({
      classItem: baseClass,
      bookings,
      userId: USER_ID,
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe(DUPLICATE_BOOKING_MESSAGE);
  });

  it('RN-03 rejects more than two classes in the same day', () => {
    const sameDay = getClassDateKey({ diaOffset: 0 });
    const bookings: Booking[] = [
      { classId: 'C-01', userId: USER_ID, dateKey: sameDay },
      { classId: 'C-04', userId: USER_ID, dateKey: sameDay },
    ];

    const result = bookClass({
      classItem: { ...baseClass, id: 'C-05', hora: '07:00' },
      bookings,
      userId: USER_ID,
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe(SAME_DAY_LIMIT_MESSAGE);
  });

  it('allows a valid reservation and reduces available capacity', () => {
    const result = bookClass({
      classItem: baseClass,
      bookings: [],
      userId: USER_ID,
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe(SUCCESS_BOOKING_MESSAGE);
    expect(result.bookings).toHaveLength(1);
    expect(result.bookings[0].classId).toBe(baseClass.id);
    expect(getRemainingCapacity(baseClass, result.bookings)).toBe(5);
  });

  it('allows cancellation when there are at least two hours left', () => {
    const classItem: ClassItem = { ...baseClass, diaOffset: 0, hora: '12:00' };
    const bookings: Booking[] = [{ classId: classItem.id, userId: USER_ID, dateKey: getClassDateKey(classItem, BASE_DATE) }];

    const result = cancelClassBooking({
      classItem,
      bookings,
      userId: USER_ID,
      now: BASE_DATE,
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe(SUCCESS_CANCEL_MESSAGE);
    expect(result.bookings).toHaveLength(0);
  });

  it('rejects cancellation when there are less than two hours left', () => {
    const classItem: ClassItem = { ...baseClass, diaOffset: 0, hora: '11:30' };
    const bookings: Booking[] = [{ classId: classItem.id, userId: USER_ID, dateKey: getClassDateKey(classItem, BASE_DATE) }];

    const result = cancelClassBooking({
      classItem,
      bookings,
      userId: USER_ID,
      now: BASE_DATE,
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe(CANCEL_DEADLINE_MESSAGE);
    expect(result.bookings).toHaveLength(1);
  });

  it('removes only the current user reservation and keeps other users untouched', () => {
    const classA: ClassItem = { ...baseClass, id: 'C-10', diaOffset: 1, hora: '09:00' };
    const classB: ClassItem = { ...baseClass, id: 'C-11', diaOffset: 0, hora: '20:00' };
    const bookings: Booking[] = [
      { classId: classA.id, userId: USER_ID, dateKey: getClassDateKey(classA, BASE_DATE_EARLY) },
      { classId: classB.id, userId: USER_ID, dateKey: getClassDateKey(classB, BASE_DATE_EARLY) },
      { classId: classA.id, userId: OTHER_USER_ID, dateKey: getClassDateKey(classA, BASE_DATE_EARLY) },
    ];

    const result = cancelClassBooking({
      classItem: classA,
      bookings,
      userId: USER_ID,
      now: BASE_DATE_EARLY,
    });

    expect(result.success).toBe(true);
    expect(result.bookings).toEqual([
      { classId: classB.id, userId: USER_ID, dateKey: getClassDateKey(classB, BASE_DATE_EARLY) },
      { classId: classA.id, userId: OTHER_USER_ID, dateKey: getClassDateKey(classA, BASE_DATE_EARLY) },
    ]);
  });

  it('returns only the current user reservations sorted from nearest to farthest', () => {
    const classA: ClassItem = { ...baseClass, id: 'C-10', diaOffset: 1, hora: '09:00' };
    const classB: ClassItem = { ...baseClass, id: 'C-11', diaOffset: 0, hora: '20:00' };
    const classC: ClassItem = { ...baseClass, id: 'C-12', diaOffset: 2, hora: '18:30' };

    const bookings: Booking[] = [
      { classId: classA.id, userId: USER_ID, dateKey: getClassDateKey(classA, BASE_DATE_EARLY) },
      { classId: classB.id, userId: USER_ID, dateKey: getClassDateKey(classB, BASE_DATE_EARLY) },
      { classId: classC.id, userId: OTHER_USER_ID, dateKey: getClassDateKey(classC, BASE_DATE_EARLY) },
    ];

    const result = getUserReservations({
      bookings,
      classes: [classA, classB, classC],
      userId: USER_ID,
      now: BASE_DATE_EARLY,
    });

    expect(result.map((item) => item.id)).toEqual(['C-11', 'C-10']);
  });
});
