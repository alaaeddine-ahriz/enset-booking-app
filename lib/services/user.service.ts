import { getUserRepository } from './index';
import type { User, CreateUserDto } from '../types';

export class UserService {
  /**
   * Get user by ID
   */
  static getUserById(id: string): User | null {
    const userRepo = getUserRepository();
    return userRepo.findById(id);
  }

  /**
   * Get user by email
   */
  static getUserByEmail(email: string): User | null {
    const userRepo = getUserRepository();
    return userRepo.findByEmail(email);
  }

  /**
   * Get all users
   */
  static getAllUsers(): User[] {
    const userRepo = getUserRepository();
    return userRepo.findAll();
  }

  /**
   * Create a new user
   */
  static createUser(data: CreateUserDto): User {
    const userRepo = getUserRepository();
    
    // Check if email already exists
    const existing = userRepo.findByEmail(data.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    return userRepo.create(data);
  }

  /**
   * Update user
   */
  static updateUser(id: string, data: Partial<CreateUserDto>): User | null {
    const userRepo = getUserRepository();
    return userRepo.update(id, data);
  }
}
