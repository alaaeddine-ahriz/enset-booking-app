import { getReservationRepository, getUserRepository } from './index';
import type {
  Reservation,
  ReservationWithDetails,
  CreateReservationDto,
  ReservationStatus,
} from '../types';

export class ReservationService {
  /**
   * Get reservations for a specific user
   */
  static getUserReservations(userId: string): ReservationWithDetails[] {
    const reservationRepo = getReservationRepository();
    return reservationRepo.findByUser(userId);
  }

  /**
   * Get all pending reservation requests (for admin)
   */
  static getPendingRequests(): ReservationWithDetails[] {
    const reservationRepo = getReservationRepository();
    return reservationRepo.findPending();
  }

  /**
   * Get reservations by status
   */
  static getReservationsByStatus(status: ReservationStatus): ReservationWithDetails[] {
    const reservationRepo = getReservationRepository();
    return reservationRepo.findAllWithDetails({ status });
  }

  /**
   * Create a new reservation request
   */
  static createReservation(data: CreateReservationDto): Reservation {
    const reservationRepo = getReservationRepository();
    
    // Check if user exists
    const userRepo = getUserRepository();
    const user = userRepo.findById(data.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check for conflicts (existing confirmed reservation at same time)
    const existingReservations = reservationRepo.findByRoom(data.roomId, data.date);
    const conflict = existingReservations.find(
      (r) =>
        r.status === 'confirmed' &&
        r.startTime === data.startTime &&
        r.endTime === data.endTime
    );
    
    if (conflict) {
      throw new Error('Time slot already booked');
    }

    return reservationRepo.create(data);
  }

  /**
   * Update reservation status (approve/refuse)
   */
  static updateReservationStatus(
    id: string,
    status: ReservationStatus
  ): Reservation | null {
    const reservationRepo = getReservationRepository();
    return reservationRepo.updateStatus(id, status);
  }

  /**
   * Get reservation details by ID
   */
  static getReservationById(id: string): ReservationWithDetails | null {
    const reservationRepo = getReservationRepository();
    return reservationRepo.findByIdWithDetails(id);
  }

  /**
   * Delete a reservation
   */
  static deleteReservation(id: string): boolean {
    const reservationRepo = getReservationRepository();
    return reservationRepo.delete(id);
  }

  /**
   * Get reservation statistics for a user
   */
  static getUserStats(userId: string): {
    total: number;
    confirmed: number;
    pending: number;
    refused: number;
  } {
    const reservationRepo = getReservationRepository();
    const reservations = reservationRepo.findByUser(userId);

    return {
      total: reservations.length,
      confirmed: reservations.filter((r) => r.status === 'confirmed').length,
      pending: reservations.filter((r) => r.status === 'pending').length,
      refused: reservations.filter((r) => r.status === 'refused').length,
    };
  }
}
