import type {
  User,
  Room,
  Reservation,
  ReservationWithDetails,
  TimeSlot,
  RoomFilters,
  ReservationFilters,
  CreateReservationDto,
  CreateRoomDto,
  CreateUserDto,
  ReservationStatus,
} from '../types';

// Repository interfaces - implement these for different database providers

export interface IUserRepository {
  findById(id: string): User | null;
  findByEmail(email: string): User | null;
  findAll(): User[];
  create(data: CreateUserDto): User;
  update(id: string, data: Partial<CreateUserDto>): User | null;
  delete(id: string): boolean;
}

export interface IRoomRepository {
  findById(id: string): Room | null;
  findAll(filters?: RoomFilters): Room[];
  findByBuilding(building: string): Room[];
  create(data: CreateRoomDto): Room;
  update(id: string, data: Partial<CreateRoomDto>): Room | null;
  delete(id: string): boolean;
  getEquipmentList(): string[];
  getBuildingList(): string[];
}

export interface IReservationRepository {
  findById(id: string): Reservation | null;
  findByIdWithDetails(id: string): ReservationWithDetails | null;
  findAll(filters?: ReservationFilters): Reservation[];
  findAllWithDetails(filters?: ReservationFilters): ReservationWithDetails[];
  findByUser(userId: string): ReservationWithDetails[];
  findByRoom(roomId: string, date?: string): Reservation[];
  findByDate(date: string): ReservationWithDetails[];
  findPending(): ReservationWithDetails[];
  create(data: CreateReservationDto): Reservation;
  updateStatus(id: string, status: ReservationStatus): Reservation | null;
  delete(id: string): boolean;
  getTimeSlots(roomId: string, date: string, currentUserId?: string): TimeSlot[];
}

// Export type for repository factory
export interface Repositories {
  users: IUserRepository;
  rooms: IRoomRepository;
  reservations: IReservationRepository;
}
