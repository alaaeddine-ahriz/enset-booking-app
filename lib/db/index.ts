import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database file path - stored in project root
const DB_PATH = path.join(process.cwd(), 'data', 'gestion-salles.db');

// Singleton database instance
let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Create database connection
    db = new Database(DB_PATH);
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Initialize schema
    initializeSchema(db);
  }
  return db;
}

function initializeSchema(database: Database.Database): void {
  // Read and execute schema
  const schemaPath = path.join(__dirname, 'schema.sql');
  
  // For Next.js, we need to handle the path differently in production
  let schema: string;
  try {
    schema = fs.readFileSync(schemaPath, 'utf-8');
  } catch {
    // Fallback: read from lib/db/schema.sql relative to cwd
    const fallbackPath = path.join(process.cwd(), 'lib', 'db', 'schema.sql');
    schema = fs.readFileSync(fallbackPath, 'utf-8');
  }
  
  database.exec(schema);
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// Helper to generate UUIDs (simple implementation)
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}
