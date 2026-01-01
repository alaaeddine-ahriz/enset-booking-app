import type { Database } from 'better-sqlite3';
import { getDatabase, generateId } from '../db';
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
  TimeSlotType,
} from '../types';
import type { IUserRepository, IRoomRepository, IReservationRepository } from './index';

// SQLite User Repository
export class SQLiteUserRepository implements IUserRepository {
  private db: Database;

  constructor() {
    this.db = getDatabase();
  }

  findById(id: string): User | null {
    const row = this.db.prepare(`
      SELECT id, name, email, role, department, avatar_initials as avatarInitials
      FROM users WHERE id = ?
    `).get(id) as User | undefined;
    return row || null;
  }

  findByEmail(email: string): User | null {
    const row = this.db.prepare(`
      SELECT id, name, email, role, department, avatar_initials as avatarInitials
      FROM users WHERE email = ?
    `).get(email) as User | undefined;
    return row || null;
  }

  findAll(): User[] {
    return this.db.prepare(`
      SELECT id, name, email, role, department, avatar_initials as avatarInitials
      FROM users ORDER BY name
    `).all() as User[];
  }

  create(data: CreateUserDto): User {
    const id = generateId();
    const avatarInitials = data.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    this.db.prepare(`
      INSERT INTO users (id, name, email, role, department, avatar_initials)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, data.name, data.email, data.role, data.department, avatarInitials);

    return this.findById(id)!;
  }

  update(id: string, data: Partial<CreateUserDto>): User | null {
    const existing = this.findById(id);
    if (!existing) return null;

    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
      updates.push('avatar_initials = ?');
      values.push(
        data.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      );
    }
    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email);
    }
    if (data.role !== undefined) {
      updates.push('role = ?');
      values.push(data.role);
    }
    if (data.department !== undefined) {
      updates.push('department = ?');
      values.push(data.department);
    }

    if (updates.length > 0) {
      values.push(id);
      this.db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }

    return this.findById(id);
  }

  delete(id: string): boolean {
    const result = this.db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

// SQLite Room Repository
export class SQLiteRoomRepository implements IRoomRepository {
  private db: Database;

  constructor() {
    this.db = getDatabase();
  }

  findById(id: string): Room | null {
    const row = this.db.prepare(`
      SELECT id, name, type, capacity, building FROM rooms WHERE id = ?
    `).get(id) as Omit<Room, 'equipment'> | undefined;

    if (!row) return null;

    const equipment = this.db
      .prepare('SELECT equipment FROM room_equipment WHERE room_id = ?')
      .all(id) as { equipment: string }[];

    return {
      ...row,
      equipment: equipment.map((e) => e.equipment),
    };
  }

  findAll(filters?: RoomFilters): Room[] {
    let query = 'SELECT id, name, type, capacity, building FROM rooms WHERE 1=1';
    const params: (string | number)[] = [];

    if (filters?.building) {
      query += ' AND building = ?';
      params.push(filters.building);
    }
    if (filters?.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }
    if (filters?.minCapacity) {
      query += ' AND capacity >= ?';
      params.push(filters.minCapacity);
    }

    query += ' ORDER BY building, name';

    const rows = this.db.prepare(query).all(...params) as Omit<Room, 'equipment'>[];

    // Get equipment for each room
    const roomsWithEquipment = rows.map((room) => {
      const equipment = this.db
        .prepare('SELECT equipment FROM room_equipment WHERE room_id = ?')
        .all(room.id) as { equipment: string }[];

      return {
        ...room,
        equipment: equipment.map((e) => e.equipment),
      };
    });

    // Filter by equipment if specified
    if (filters?.equipment && filters.equipment.length > 0) {
      return roomsWithEquipment.filter((room) =>
        filters.equipment!.every((eq) => room.equipment.includes(eq))
      );
    }

    return roomsWithEquipment;
  }

  findByBuilding(building: string): Room[] {
    return this.findAll({ building });
  }

  create(data: CreateRoomDto): Room {
    const id = generateId();

    this.db.prepare(`
      INSERT INTO rooms (id, name, type, capacity, building)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, data.name, data.type, data.capacity, data.building);

    // Add equipment
    const insertEquip = this.db.prepare(
      'INSERT INTO room_equipment (room_id, equipment) VALUES (?, ?)'
    );
    for (const eq of data.equipment) {
      insertEquip.run(id, eq);
    }

    return this.findById(id)!;
  }

  update(id: string, data: Partial<CreateRoomDto>): Room | null {
    const existing = this.findById(id);
    if (!existing) return null;

    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.type !== undefined) {
      updates.push('type = ?');
      values.push(data.type);
    }
    if (data.capacity !== undefined) {
      updates.push('capacity = ?');
      values.push(data.capacity);
    }
    if (data.building !== undefined) {
      updates.push('building = ?');
      values.push(data.building);
    }

    if (updates.length > 0) {
      values.push(id);
      this.db.prepare(`UPDATE rooms SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }

    // Update equipment if provided
    if (data.equipment !== undefined) {
      this.db.prepare('DELETE FROM room_equipment WHERE room_id = ?').run(id);
      const insertEquip = this.db.prepare(
        'INSERT INTO room_equipment (room_id, equipment) VALUES (?, ?)'
      );
      for (const eq of data.equipment) {
        insertEquip.run(id, eq);
      }
    }

    return this.findById(id);
  }

  delete(id: string): boolean {
    const result = this.db.prepare('DELETE FROM rooms WHERE id = ?').run(id);
    return result.changes > 0;
  }

  getEquipmentList(): string[] {
    const rows = this.db
      .prepare('SELECT DISTINCT equipment FROM room_equipment ORDER BY equipment')
      .all() as { equipment: string }[];
    return rows.map((r) => r.equipment);
  }

  getBuildingList(): string[] {
    const rows = this.db
      .prepare('SELECT DISTINCT building FROM rooms ORDER BY building')
      .all() as { building: string }[];
    return rows.map((r) => r.building);
  }
}

// SQLite Reservation Repository
export class SQLiteReservationRepository implements IReservationRepository {
  private db: Database;

  constructor() {
    this.db = getDatabase();
  }

  private mapRow(row: Record<string, unknown>): Reservation {
    return {
      id: row.id as string,
      roomId: row.room_id as string,
      userId: row.user_id as string,
      courseName: row.course_name as string,
      date: row.date as string,
      startTime: row.start_time as string,
      endTime: row.end_time as string,
      status: row.status as ReservationStatus,
      isRecurring: Boolean(row.is_recurring),
      createdAt: row.created_at as string,
    };
  }

  private mapRowWithDetails(row: Record<string, unknown>): ReservationWithDetails {
    return {
      ...this.mapRow(row),
      roomName: row.room_name as string,
      roomBuilding: row.room_building as string,
      userName: row.user_name as string,
      userDepartment: row.user_department as string,
      userAvatarInitials: row.user_avatar_initials as string,
    };
  }

  findById(id: string): Reservation | null {
    const row = this.db.prepare(`
      SELECT * FROM reservations WHERE id = ?
    `).get(id) as Record<string, unknown> | undefined;
    return row ? this.mapRow(row) : null;
  }

  findByIdWithDetails(id: string): ReservationWithDetails | null {
    const row = this.db.prepare(`
      SELECT 
        r.*,
        rm.name as room_name,
        rm.building as room_building,
        u.name as user_name,
        u.department as user_department,
        u.avatar_initials as user_avatar_initials
      FROM reservations r
      JOIN rooms rm ON r.room_id = rm.id
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `).get(id) as Record<string, unknown> | undefined;
    return row ? this.mapRowWithDetails(row) : null;
  }

  findAll(filters?: ReservationFilters): Reservation[] {
    let query = 'SELECT * FROM reservations WHERE 1=1';
    const params: string[] = [];

    if (filters?.userId) {
      query += ' AND user_id = ?';
      params.push(filters.userId);
    }
    if (filters?.roomId) {
      query += ' AND room_id = ?';
      params.push(filters.roomId);
    }
    if (filters?.date) {
      query += ' AND date = ?';
      params.push(filters.date);
    }
    if (filters?.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY date, start_time';

    const rows = this.db.prepare(query).all(...params) as Record<string, unknown>[];
    return rows.map((row) => this.mapRow(row));
  }

  findAllWithDetails(filters?: ReservationFilters): ReservationWithDetails[] {
    let query = `
      SELECT 
        r.*,
        rm.name as room_name,
        rm.building as room_building,
        u.name as user_name,
        u.department as user_department,
        u.avatar_initials as user_avatar_initials
      FROM reservations r
      JOIN rooms rm ON r.room_id = rm.id
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    const params: string[] = [];

    if (filters?.userId) {
      query += ' AND r.user_id = ?';
      params.push(filters.userId);
    }
    if (filters?.roomId) {
      query += ' AND r.room_id = ?';
      params.push(filters.roomId);
    }
    if (filters?.date) {
      query += ' AND r.date = ?';
      params.push(filters.date);
    }
    if (filters?.status) {
      query += ' AND r.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY r.date, r.start_time';

    const rows = this.db.prepare(query).all(...params) as Record<string, unknown>[];
    return rows.map((row) => this.mapRowWithDetails(row));
  }

  findByUser(userId: string): ReservationWithDetails[] {
    return this.findAllWithDetails({ userId });
  }

  findByRoom(roomId: string, date?: string): Reservation[] {
    return this.findAll({ roomId, date });
  }

  findByDate(date: string): ReservationWithDetails[] {
    return this.findAllWithDetails({ date });
  }

  findPending(): ReservationWithDetails[] {
    return this.findAllWithDetails({ status: 'pending' });
  }

  create(data: CreateReservationDto): Reservation {
    const id = generateId();
    const createdAt = new Date().toISOString();

    this.db.prepare(`
      INSERT INTO reservations (id, room_id, user_id, course_name, date, start_time, end_time, status, is_recurring, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `).run(
      id,
      data.roomId,
      data.userId,
      data.courseName,
      data.date,
      data.startTime,
      data.endTime,
      data.isRecurring ? 1 : 0,
      createdAt
    );

    return this.findById(id)!;
  }

  updateStatus(id: string, status: ReservationStatus): Reservation | null {
    const existing = this.findById(id);
    if (!existing) return null;

    this.db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, id);
    return this.findById(id);
  }

  delete(id: string): boolean {
    const result = this.db.prepare('DELETE FROM reservations WHERE id = ?').run(id);
    return result.changes > 0;
  }

  getTimeSlots(roomId: string, date: string, currentUserId?: string): TimeSlot[] {
    // Standard time slots for the day
    const standardSlots = [
      { start: '08:30', end: '10:30' },
      { start: '10:30', end: '12:30' },
      { start: '14:00', end: '16:00' },
      { start: '16:00', end: '18:00' },
    ];

    // Get reservations for this room on this date
    const reservations = this.db.prepare(`
      SELECT 
        r.*,
        u.name as user_name
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      WHERE r.room_id = ? AND r.date = ? AND r.status != 'refused'
    `).all(roomId, date) as Record<string, unknown>[];

    return standardSlots.map((slot) => {
      const reservation = reservations.find(
        (r) => r.start_time === slot.start && r.end_time === slot.end
      );

      if (!reservation) {
        return {
          startTime: slot.start,
          endTime: slot.end,
          type: 'available' as TimeSlotType,
        };
      }

      const isMyBooking = currentUserId && reservation.user_id === currentUserId;

      return {
        startTime: slot.start,
        endTime: slot.end,
        type: isMyBooking ? 'myBooking' : 'booked' as TimeSlotType,
        title: reservation.course_name as string,
        subtitle: reservation.user_name as string,
        reservationId: reservation.id as string,
      };
    });
  }
}
