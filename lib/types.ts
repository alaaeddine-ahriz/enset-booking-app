// Core domain types for the room reservation system

export type UserRole = 'teacher' | 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarInitials?: string;
}

export type RoomType = 'Salle' | 'Amphi' | 'Labo';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  building: string;
  equipment: string[];
}

export type ReservationStatus = 'pending' | 'confirmed' | 'refused';

export interface Reservation {
  id: string;
  roomId: string;
  userId: string;
  courseName: string;
  date: string; // ISO date string YYYY-MM-DD
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  status: ReservationStatus;
  isRecurring: boolean;
  createdAt: string;
}

// Extended reservation with related data for display
export interface ReservationWithDetails extends Reservation {
  roomName: string;
  roomBuilding: string;
  userName: string;
  userDepartment: string;
  userAvatarInitials: string;
}

export type TimeSlotType = 'available' | 'booked' | 'myBooking' | 'maintenance';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  type: TimeSlotType;
  title?: string;
  subtitle?: string;
  reservationId?: string;
}

// Filter types for queries
export interface RoomFilters {
  building?: string;
  type?: RoomType;
  equipment?: string[];
  minCapacity?: number;
}

export interface ReservationFilters {
  userId?: string;
  roomId?: string;
  date?: string;
  status?: ReservationStatus;
}

// Create/Update DTOs
export interface CreateReservationDto {
  roomId: string;
  userId: string;
  courseName: string;
  date: string;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
}

export interface UpdateReservationStatusDto {
  status: ReservationStatus;
}

export interface CreateRoomDto {
  name: string;
  type: RoomType;
  capacity: number;
  building: string;
  equipment: string[];
}

export interface CreateUserDto {
  name: string;
  email: string;
  role: UserRole;
  department: string;
}
