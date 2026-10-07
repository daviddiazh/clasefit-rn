import type { Booking, BookingResult, ClassItem } from '../types/classBooking';

export const padDatePart = (value: number): string => String(value).padStart(2, '0');

export const getClassDateKey = (
  classItem: Pick<ClassItem, 'diaOffset'>,
  baseDate: Date = new Date(),
): string => {
  const date = new Date(baseDate);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + classItem.diaOffset);

  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
};

export const getClassStartDateTime = (
  classItem: Pick<ClassItem, 'diaOffset' | 'hora'>,
  baseDate: Date = new Date(),
): Date => {
  const [hours, minutes] = classItem.hora.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + classItem.diaOffset);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const getRemainingCapacity = (
  classItem: ClassItem,
  bookings: Booking[] = [],
  userId?: string,
): number => {
  const reservedForClass = bookings.filter((booking) => booking.classId === classItem.id);
  const userBookings = userId
    ? reservedForClass.filter((booking) => booking.userId === userId).length
    : reservedForClass.length;

  return Math.max(classItem.cupoTotal - classItem.ocupados - userBookings, 0);
};

export const bookClass = ({
  classItem,
  bookings,
  userId,
}: {
  classItem: ClassItem;
  bookings: Booking[];
  userId: string;
}): BookingResult => {
  const remainingCapacity = getRemainingCapacity(classItem, bookings, userId);

  if (remainingCapacity <= 0) {
    return {
      success: false,
      message: 'Esta clase ya no tiene cupos.',
      bookings,
    };
  }

  const alreadyBooked = bookings.some(
    (booking) => booking.classId === classItem.id && booking.userId === userId,
  );

  if (alreadyBooked) {
    return {
      success: false,
      message: 'Ya reservaste esta clase.',
      bookings,
    };
  }

  const sameDayCount = bookings.filter(
    (booking) => booking.userId === userId && booking.dateKey === getClassDateKey(classItem),
  ).length;

  if (sameDayCount >= 2) {
    return {
      success: false,
      message: 'Solo puedes reservar 2 clases por día.',
      bookings,
    };
  }

  const nextBookings: Booking[] = [
    ...bookings,
    {
      classId: classItem.id,
      userId,
      dateKey: getClassDateKey(classItem),
    },
  ];

  return {
    success: true,
    message: '¡Listo! Tu cupo está reservado',
    bookings: nextBookings,
  };
};

export const canCancelReservation = ({
  classItem,
  now = new Date(),
}: {
  classItem: Pick<ClassItem, 'diaOffset' | 'hora'>;
  now?: Date;
}): boolean => {
  const classStartDate = getClassStartDateTime(classItem, now);
  const remainingMs = classStartDate.getTime() - now.getTime();
  const cutoffMs = 2 * 60 * 60 * 1000;

  return remainingMs >= cutoffMs;
};

export const cancelClassBooking = ({
  classItem,
  bookings,
  userId,
  now = new Date(),
}: {
  classItem: ClassItem;
  bookings: Booking[];
  userId: string;
  now?: Date;
}): BookingResult => {
  if (!canCancelReservation({ classItem, now })) {
    return {
      success: false,
      message: 'Ya no puedes cancelar: faltan menos de 2 horas.',
      bookings,
    };
  }

  const nextBookings = bookings.filter(
    (booking) => !(booking.classId === classItem.id && booking.userId === userId),
  );

  return {
    success: true,
    message: 'Reserva cancelada correctamente.',
    bookings: nextBookings,
  };
};

export const getUserReservations = ({
  bookings,
  classes,
  userId,
  now = new Date(),
}: {
  bookings: Booking[];
  classes: ClassItem[];
  userId: string;
  now?: Date;
}): ClassItem[] => {
  const bookedClassIds = new Set(
    bookings.filter((booking) => booking.userId === userId).map((booking) => booking.classId),
  );

  return classes
    .filter((classItem) => bookedClassIds.has(classItem.id))
    .sort((a, b) => getClassStartDateTime(a, now).getTime() - getClassStartDateTime(b, now).getTime());
};
