import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';

// Check for the database URL
if (!process.env.DATABASE_URL) {
  console.warn("No DATABASE_URL environment variable found. Using in-memory storage instead.");
}

// Initialize database connection if URL is available
let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema });
    console.log("Connected to database successfully!");
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
}

export { db };

// Export a helper function to check if the database is available
export const isDatabaseAvailable = (): boolean => {
  return db !== null;
};

// Function to initialize the database connection
export const initializeDatabase = async (): Promise<void> => {
  if (!process.env.DATABASE_URL) {
    console.error("Cannot initialize database: DATABASE_URL is not set");
    return;
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema });
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

// Generic database query wrapper with error handling
export async function query<T>(
  operation: () => Promise<T>
): Promise<T | null> {
  if (!db) {
    console.error("Database not available");
    return null;
  }

  try {
    return await operation();
  } catch (error) {
    console.error("Database operation failed:", error);
    return null;
  }
}
