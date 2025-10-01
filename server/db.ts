import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  // Use connection pool for better connection management
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // Disable SSL for internal Replit connections
    max: 10, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection cannot be established
    allowExitOnIdle: false, // Don't exit when all connections are idle
  });

  // Handle pool errors
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  db = drizzle(pool, { schema });
  console.log('📦 Database connection established');
} else {
  console.log('⚠️  DATABASE_URL not found - using in-memory storage fallback');
}

export { db };
