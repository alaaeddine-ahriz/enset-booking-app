/**
 * Database seed script
 * Run with: npx tsx lib/db/seed.ts
 */

import { getDatabase, generateId } from './index';

// Seed data based on existing mock data
const users = [
  { name: 'Souad Amitou', email: 'souad@enset.ma', role: 'teacher', department: 'Informatique' },
  { name: 'Prof. Ahmed', email: 'ahmed@enset.ma', role: 'teacher', department: 'Informatique' },
  { name: 'Prof. Fatima', email: 'fatima@enset.ma', role: 'teacher', department: 'Mathématiques' },
  { name: 'Prof. Hassan', email: 'hassan@enset.ma', role: 'teacher', department: 'Informatique' },
  { name: 'Admin User', email: 'admin@enset.ma', role: 'admin', department: 'Administration' },
];

const rooms = [
  { name: 'Salle A101', type: 'Salle', capacity: 40, building: 'Bâtiment A', equipment: ['Projecteur', 'Tableau blanc'] },
  { name: 'Amphi B', type: 'Amphi', capacity: 200, building: 'Bâtiment B', equipment: ['Projecteur', 'Micro'] },
  { name: 'Labo Info 1', type: 'Labo', capacity: 30, building: 'Bâtiment C', equipment: ['Ordinateurs', 'Projecteur'] },
  { name: 'Salle A102', type: 'Salle', capacity: 35, building: 'Bâtiment A', equipment: ['Projecteur', 'Tableau blanc'] },
  { name: 'Labo Info 2', type: 'Labo', capacity: 25, building: 'Bâtiment C', equipment: ['Ordinateurs'] },
];

function seed() {
  console.log('🌱 Seeding database...');
  
  const db = getDatabase();

  // Clear existing data
  db.exec('DELETE FROM reservations');
  db.exec('DELETE FROM room_equipment');
  db.exec('DELETE FROM rooms');
  db.exec('DELETE FROM users');

  console.log('📝 Creating users...');
  const userIds: Record<string, string> = {};
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, role, department, avatar_initials)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const user of users) {
    const id = generateId();
    const initials = user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    insertUser.run(id, user.name, user.email, user.role, user.department, initials);
    userIds[user.email] = id;
    console.log(`  ✓ Created user: ${user.name}`);
  }

  console.log('🏢 Creating rooms...');
  const roomIds: Record<string, string> = {};
  const insertRoom = db.prepare(`
    INSERT INTO rooms (id, name, type, capacity, building)
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertEquipment = db.prepare(`
    INSERT INTO room_equipment (room_id, equipment) VALUES (?, ?)
  `);

  for (const room of rooms) {
    const id = generateId();
    insertRoom.run(id, room.name, room.type, room.capacity, room.building);
    
    for (const eq of room.equipment) {
      insertEquipment.run(id, eq);
    }
    
    roomIds[room.name] = id;
    console.log(`  ✓ Created room: ${room.name}`);
  }

  console.log('📅 Creating sample reservations...');
  const insertReservation = db.prepare(`
    INSERT INTO reservations (id, room_id, user_id, course_name, date, start_time, end_time, status, is_recurring, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const reservations = [
    {
      room: 'Salle A101',
      user: 'souad@enset.ma',
      course: 'Développement Web Avancé',
      date: '2026-01-06',
      startTime: '08:30',
      endTime: '10:30',
      status: 'confirmed',
    },
    {
      room: 'Amphi B',
      user: 'souad@enset.ma',
      course: 'Base de Données',
      date: '2026-01-07',
      startTime: '14:00',
      endTime: '16:00',
      status: 'pending',
    },
    {
      room: 'Labo Info 2',
      user: 'souad@enset.ma',
      course: 'Architecture des Systèmes',
      date: '2026-01-08',
      startTime: '10:30',
      endTime: '12:30',
      status: 'refused',
    },
    {
      room: 'Salle A101',
      user: 'ahmed@enset.ma',
      course: 'Cours de Java',
      date: '2026-01-06',
      startTime: '10:30',
      endTime: '12:30',
      status: 'confirmed',
    },
    {
      room: 'Salle A101',
      user: 'fatima@enset.ma',
      course: 'Algèbre Linéaire',
      date: '2026-01-07',
      startTime: '08:30',
      endTime: '10:30',
      status: 'pending',
    },
  ];

  for (const res of reservations) {
    const id = generateId();
    insertReservation.run(
      id,
      roomIds[res.room],
      userIds[res.user],
      res.course,
      res.date,
      res.startTime,
      res.endTime,
      res.status,
      0,
      new Date().toISOString()
    );
    console.log(`  ✓ Created reservation: ${res.course}`);
  }

  console.log('✅ Database seeded successfully!');
}

// Run seed
seed();
