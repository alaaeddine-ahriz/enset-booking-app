import {
  SQLiteUserRepository,
  SQLiteRoomRepository,
  SQLiteReservationRepository,
} from '../repositories/sqlite';
import type {
  IUserRepository,
  IRoomRepository,
  IReservationRepository,
  Repositories,
} from '../repositories';

// Service factory - swap implementations here when changing providers
function createRepositories(): Repositories {
  return {
    users: new SQLiteUserRepository(),
    rooms: new SQLiteRoomRepository(),
    reservations: new SQLiteReservationRepository(),
  };
}

// Singleton repositories
let repositories: Repositories | null = null;

export function getRepositories(): Repositories {
  if (!repositories) {
    repositories = createRepositories();
  }
  return repositories;
}

// Individual repository getters for convenience
export function getUserRepository(): IUserRepository {
  return getRepositories().users;
}

export function getRoomRepository(): IRoomRepository {
  return getRepositories().rooms;
}

export function getReservationRepository(): IReservationRepository {
  return getRepositories().reservations;
}
