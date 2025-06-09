import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/, 'PORT must be a number').transform(Number),

  USER_PORT: z
    .string()
    .regex(/^\d+$/, 'PORT must be a number')
    .transform(Number),

  AUTH_PORT: z
    .string()
    .regex(/^\d+$/, 'PORT must be a number')
    .transform(Number),

  ADMIN_PORT: z
    .string()
    .regex(/^\d+$/, 'PORT must be a number')
    .transform(Number),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN is required'),

  ACCESS_TOKEN_SECRET: z.string().min(1, 'ACCESS_TOKEN_SECRET is required'),
  ACCESS_TOKEN_EXPIRY: z
    .string()
    .regex(/^\d+[smhd]$/, 'ACCESS_TOKEN_EXPIRY must be like 1d, 2h, etc.'),

  REFRESH_TOKEN_SECRET: z.string().min(1, 'REFRESH_TOKEN_SECRET is required'),
  REFRESH_TOKEN_EXPIRY: z
    .string()
    .regex(/^\d+[smhd]$/, 'REFRESH_TOKEN_EXPIRY must be like 10d, 1h, etc.'),

  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid or missing environment variables:');
  console.error(parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;
