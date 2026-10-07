import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Booking, ClassBookingState, ClassItem, UserProfile } from '../types/classBooking';
import { bookClass, cancelClassBooking } from '../utils/classBooking';

const mockData = require('../../mock-data/clases.json') as {
  socio: UserProfile;
  clases: ClassItem[];
};

type MessageType = 'success' | 'error';

interface AppMessage {
  text: string;
  type: MessageType;
}

interface ClassBookingContextValue extends ClassBookingState {
  message: AppMessage | null;
  bookClassForUser: (classItem: ClassItem) => boolean;
  cancelClassForUser: (classItem: ClassItem) => boolean;
  clearMessage: () => void;
}

const ClassBookingContext = createContext<ClassBookingContextValue | undefined>(undefined);

export const ClassBookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile] = useState<UserProfile>(mockData.socio);
  const [classes, setClasses] = useState<ClassItem[]>(mockData.clases);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState<AppMessage | null>(null);
  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enqueueMessage = (text: string, type: MessageType) => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    setMessage({ text, type });
    messageTimeoutRef.current = setTimeout(() => {
      setMessage(null);
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const bookClassForUser = (classItem: ClassItem): boolean => {
    const result = bookClass({
      classItem,
      bookings,
      userId: profile.id,
    });

    if (!result.success) {
      enqueueMessage(result.message, 'error');
      return false;
    }

    setBookings(result.bookings);
    setClasses((currentClasses) =>
      currentClasses.map((item) =>
        item.id === classItem.id ? { ...item, ocupados: item.ocupados + 1 } : item,
      ),
    );
    enqueueMessage(result.message, 'success');
    return true;
  };

  const cancelClassForUser = (classItem: ClassItem): boolean => {
    const bookingExists = bookings.some(
      (booking) => booking.classId === classItem.id && booking.userId === profile.id,
    );

    if (!bookingExists) {
      enqueueMessage('No tienes una reserva activa para esta clase.', 'error');
      return false;
    }

    const result = cancelClassBooking({
      classItem,
      bookings,
      userId: profile.id,
    });

    if (!result.success) {
      enqueueMessage(result.message, 'error');
      return false;
    }

    setBookings(result.bookings);
    setClasses((currentClasses) =>
      currentClasses.map((item) =>
        item.id === classItem.id ? { ...item, ocupados: Math.max(item.ocupados - 1, 0) } : item,
      ),
    );
    enqueueMessage(result.message, 'success');
    return true;
  };

  const clearMessage = () => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    setMessage(null);
  };

  const value = useMemo<ClassBookingContextValue>(
    () => ({
      profile,
      classes,
      bookings,
      message,
      clearMessage,
      bookClassForUser,
      cancelClassForUser,
    }),
    [profile, classes, bookings, message],
  );

  return <ClassBookingContext.Provider value={value}>{children}</ClassBookingContext.Provider>;
};

export const useClassBookingContext = (): ClassBookingContextValue => {
  const context = useContext(ClassBookingContext);

  if (!context) {
    throw new Error('useClassBookingContext must be used within a ClassBookingProvider');
  }

  return context;
};
