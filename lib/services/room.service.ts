import { getRoomRepository } from './index';
import type { Room, RoomFilters, TimeSlot } from '../types';
import { getReservationRepository } from './index';

export class RoomService {
  /**
   * Get all rooms with optional filtering
   */
  static getRooms(filters?: RoomFilters): Room[] {
    const roomRepo = getRoomRepository();
    return roomRepo.findAll(filters);
  }

  /**
   * Get a single room by ID
   */
  static getRoomById(id: string): Room | null {
    const roomRepo = getRoomRepository();
    return roomRepo.findById(id);
  }

  /**
   * Get room availability (time slots) for a specific date
   */
  static getAvailability(roomId: string, date: string, currentUserId?: string): TimeSlot[] {
    const reservationRepo = getReservationRepository();
    return reservationRepo.getTimeSlots(roomId, date, currentUserId);
  }

  /**
   * Get list of all buildings
   */
  static getBuildings(): string[] {
    const roomRepo = getRoomRepository();
    return roomRepo.getBuildingList();
  }

  /**
   * Get list of all equipment types
   */
  static getEquipment(): string[] {
    const roomRepo = getRoomRepository();
    return roomRepo.getEquipmentList();
  }
}
