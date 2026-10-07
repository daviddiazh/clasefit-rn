export interface UserProfile {
  id: string;
  nombre: string;
}

export interface ClassItem {
  id: string;
  nombre: string;
  instructor: string;
  diaOffset: number;
  hora: string;
  duracionMin: number;
  cupoTotal: number;
  ocupados: number;
}

export interface Booking {
  classId: string;
  userId: string;
  dateKey: string;
}

export interface BookingResult {
  success: boolean;
  message: string;
  bookings: Booking[];
}

export interface ClassBookingState {
  profile: UserProfile;
  classes: ClassItem[];
  bookings: Booking[];
}
