import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Function to create tables
const createTables = async () => {
    const client = await pool.connect();
    try {
        console.log('Creating database tables if not exists...');

        // Create students table
        await client.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                mobile_no VARCHAR(15) UNIQUE NOT NULL,
                email_id VARCHAR(100) UNIQUE NOT NULL,
                class VARCHAR(20) NOT NULL,
                school_address TEXT NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Students table created/verified');

        // Create indexes for faster queries
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_students_email ON students(email_id);
            CREATE INDEX IF NOT EXISTS idx_students_mobile ON students(mobile_no);
        `);
        console.log('✓ Indexes created/verified');

        // Create admins table (optional - for future use)
        await client.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Admins table created/verified');

        console.log('All database tables are ready!');
    } catch (error) {
        console.error('Error creating tables:', error.message);
        throw error;
    } finally {
        client.release();
    }
};

// Test database connection and create tables
const initializeDatabase = async () => {
    try {
        // Test connection
        await pool.query('SELECT NOW()');
        console.log('✅ Successfully connected to PostgreSQL database');
        
        // Create tables
        await createTables();
        
        return true;
    } catch (err) {
        console.error('❌ Database initialization error:', err.stack);
        console.error('\nPlease make sure:');
        console.error('1. PostgreSQL is installed and running');
        console.error('2. Database credentials in .env file are correct');
        console.error('3. Database "' + process.env.DB_NAME + '" exists (or create it manually)');
        return false;
    }
};

// Initialize database on startup
initializeDatabase();

export default pool;