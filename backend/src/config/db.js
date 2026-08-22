import pg from 'pg';
import { PrismaClient } from '@prisma/client';
import { env } from './env.js';
import { logger } from './logger.js';

const { Pool, Client } = pg;

// PostgreSQL native pool for direct queries & transactions
export const pgPool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pgPool.on('error', (err) => {
  logger.error({ err }, 'Unexpected error on idle PostgreSQL client');
});

// Prisma Client Singleton
let prismaInstance;

try {
  prismaInstance = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
    ],
  });

  if (env.NODE_ENV !== 'production') {
    global.prisma = prismaInstance;
  }
} catch (err) {
  logger.warn('Prisma client not yet generated. Database queries will fallback gracefully.');
}

export const prisma = prismaInstance;

/**
 * Automatically ensures the database exists by connecting to the default postgres database first
 */
async function ensureDatabaseExists() {
  try {
    const url = new URL(env.DATABASE_URL);
    const targetDb = url.pathname.replace(/^\//, '') || 'dayflow_hrms';

    if (targetDb === 'postgres') {
      return; // Already default db
    }

    // Connect to the default 'postgres' database to check/create the target database
    const postgresUrl = new URL(env.DATABASE_URL);
    postgresUrl.pathname = '/postgres';

    const client = new Client({ connectionString: postgresUrl.toString() });
    await client.connect();

    try {
      const checkRes = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [targetDb]
      );

      if (checkRes.rowCount === 0) {
        logger.info(`📦 Database "${targetDb}" does not exist. Creating it automatically...`);
        // Escape database name safely
        await client.query(`CREATE DATABASE "${targetDb.replace(/"/g, '""')}"`);
        logger.info(`✅ Database "${targetDb}" created successfully!`);
      }
    } finally {
      await client.end();
    }
  } catch (err) {
    logger.warn({ err: err.message }, 'Could not auto-create database (might already exist or insufficient privileges)');
  }
}

/**
 * Initializes DB tables if running directly on PostgreSQL without prior migration
 */
export async function initializeDatabase() {
  // 1. Automatically create database if it does not exist
  await ensureDatabaseExists();

  // 2. Connect to the target dayflow_hrms database
  const client = await pgPool.connect();
  try {
    logger.info('🐘 Connecting to PostgreSQL...');
    await client.query('SELECT 1');
    logger.info('✅ PostgreSQL connected successfully');

    // Create schema tables if not exist
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "Role" AS ENUM ('ADMIN', 'HR', 'EMPLOYEE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY,
        "email" TEXT UNIQUE NOT NULL,
        "loginId" TEXT UNIQUE NOT NULL,
        "passwordHash" TEXT NOT NULL,
        "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
        "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
        "refreshToken" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "Employee" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT UNIQUE NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
        "loginId" TEXT UNIQUE NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "mobile" TEXT,
        "profilePicture" TEXT,
        "department" TEXT NOT NULL,
        "jobPosition" TEXT NOT NULL,
        "manager" TEXT,
        "location" TEXT,
        "company" TEXT NOT NULL DEFAULT 'Dayflow Technologies Pvt Ltd',
        "dateOfJoining" TEXT NOT NULL,
        "dateOfBirth" TEXT,
        "residentialAddress" TEXT,
        "nationality" TEXT DEFAULT 'Indian',
        "personalEmail" TEXT,
        "gender" TEXT,
        "maritalStatus" TEXT,
        "about" TEXT,
        "whatILoveAboutMyJob" TEXT,
        "interestsAndHobbies" TEXT,
        "skills" JSONB NOT NULL DEFAULT '[]',
        "certifications" JSONB NOT NULL DEFAULT '[]',
        "documents" JSONB NOT NULL DEFAULT '[]',
        "bankDetails" JSONB NOT NULL DEFAULT '{}',
        "salary" JSONB NOT NULL DEFAULT '{}',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "Attendance" (
        "id" TEXT PRIMARY KEY,
        "employeeId" TEXT NOT NULL REFERENCES "Employee"("id") ON DELETE CASCADE,
        "date" TEXT NOT NULL,
        "checkInTime" TEXT,
        "checkOutTime" TEXT,
        "workHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "extraHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "status" TEXT NOT NULL DEFAULT 'Present',
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Attendance_employeeId_date_key" UNIQUE ("employeeId", "date")
      );

      CREATE TABLE IF NOT EXISTS "LeaveRequest" (
        "id" TEXT PRIMARY KEY,
        "employeeId" TEXT NOT NULL REFERENCES "Employee"("id") ON DELETE CASCADE,
        "leaveType" TEXT NOT NULL,
        "startDate" TEXT NOT NULL,
        "endDate" TEXT NOT NULL,
        "totalDays" DOUBLE PRECISION NOT NULL,
        "remarks" TEXT,
        "attachmentUrl" TEXT,
        "attachmentFileName" TEXT,
        "status" TEXT NOT NULL DEFAULT 'Pending',
        "appliedDate" TEXT NOT NULL,
        "reviewedDate" TEXT,
        "reviewedBy" TEXT,
        "reviewRemarks" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "PayrollRun" (
        "id" TEXT PRIMARY KEY,
        "employeeId" TEXT NOT NULL REFERENCES "Employee"("id") ON DELETE CASCADE,
        "month" TEXT NOT NULL,
        "year" INTEGER NOT NULL,
        "monthIndex" INTEGER NOT NULL,
        "totalWorkingDays" INTEGER NOT NULL DEFAULT 22,
        "paidDays" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "unpaidDays" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "payableDays" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "grossMonthlyWage" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "basicSalary" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "hra" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "standardAllowance" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "performanceBonus" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "lta" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "fixedAllowance" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "employeePFDeduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "employerPFContribution" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "professionalTax" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "totalDeductions" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "netPayableAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "status" TEXT NOT NULL DEFAULT 'Paid',
        "processedDate" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PayrollRun_employeeId_month_year_key" UNIQUE ("employeeId", "month", "year")
      );

      CREATE TABLE IF NOT EXISTS "Notification" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT REFERENCES "User"("id") ON DELETE CASCADE,
        "employeeId" TEXT,
        "title" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "type" TEXT NOT NULL DEFAULT 'system',
        "read" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "Company" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "prefix" TEXT NOT NULL DEFAULT 'OI',
        "domain" TEXT,
        "contactEmail" TEXT,
        "address" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS "Attendance_date_idx" ON "Attendance"("date");
      CREATE INDEX IF NOT EXISTS "Attendance_employeeId_idx" ON "Attendance"("employeeId");
      CREATE INDEX IF NOT EXISTS "LeaveRequest_employeeId_idx" ON "LeaveRequest"("employeeId");
      CREATE INDEX IF NOT EXISTS "LeaveRequest_status_idx" ON "LeaveRequest"("status");
      CREATE INDEX IF NOT EXISTS "PayrollRun_employeeId_idx" ON "PayrollRun"("employeeId");
      CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");
    `);

    logger.info('✅ PostgreSQL tables and constraints initialized successfully');
  } catch (error) {
    logger.error({ error: error.message }, '⚠️ PostgreSQL table initialization error');
    throw error;
  } finally {
    client.release();
  }
}

export default { prisma, pgPool, initializeDatabase };
