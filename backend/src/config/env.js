import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),

  // PostgreSQL Connection
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/dayflow_hrms?schema=public'),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  REDIS_PASSWORD: z.string().optional().default(''),

  // JWT Config
  JWT_ACCESS_SECRET: z.string().default('dayflow_super_secret_access_jwt_key_2026_production_grade_32chars'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().default('dayflow_super_secret_refresh_jwt_key_2026_production_grade_32chars'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // Rate Limiting
  LOGIN_RATE_LIMIT_MAX: z.string().transform(Number).default('5'),
  LOGIN_RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),

  // Brevo / SMTP Email Configuration
  SMTP_SERVER: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).default('587'),
  SMTP_USERNAME: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_USE_TLS: z.string().optional().default('true'),
  SMTP_USE_SSL: z.string().optional().default('false'),
  SMTP_FROM_EMAIL: z.string().optional(),
  SMTP_FROM_NAME: z.string().optional().default('HR'),
  EMAIL_FROM: z.string().optional(),

  // S3 / Object Storage
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().optional().default(''),
  AWS_SECRET_ACCESS_KEY: z.string().optional().default(''),
  AWS_S3_BUCKET: z.string().default('dayflow-documents'),
  AWS_S3_ENDPOINT: z.string().optional().default(''),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(parsedEnv.error.format(), null, 2));
  throw new Error('Environment configuration validation failed');
}

const raw = parsedEnv.data;

export const env = {
  ...raw,
  SMTP_HOST: raw.SMTP_SERVER || raw.SMTP_HOST || 'smtp-relay.brevo.com',
  SMTP_USER: raw.SMTP_USERNAME || raw.SMTP_USER || '',
  SMTP_PASS: raw.SMTP_PASSWORD || raw.SMTP_PASS || '',
  EMAIL_FROM: raw.SMTP_FROM_EMAIL
    ? `"${raw.SMTP_FROM_NAME || 'HR'}" <${raw.SMTP_FROM_EMAIL}>`
    : raw.EMAIL_FROM || '"HR" <naveenatdevine@gmail.com>',
};

export default env;
