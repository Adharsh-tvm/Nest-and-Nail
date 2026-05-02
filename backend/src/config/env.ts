import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),

  PORT: z.coerce.number().default(4000),

  // Logging
  LOG_RETENTION_DAYS: z.coerce.number().int().positive().default(14),
  LOG_MAX_SIZE: z.string().default("20m"),
  ERROR_LOG_MAX_SIZE: z.string().default("10m"),
  // Database
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),

  // JWT
  ACCESS_TOKEN_SECRET: z.string().min(16, "ACCESS_TOKEN_SECRET too short"),
  REFRESH_TOKEN_SECRET: z.string().min(16, "REFRESH_TOKEN_SECRET too short"),
  ACCESS_TOKEN_MAX_AGE: z.string(),
  REFRESH_TOKEN_MAX_AGE: z.string(),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  // Email
  EMAIL_USER: z.string().email(),
  EMAIL_PASS: z.string().min(1),

  // Frontend
  FRONTEND_URL: z.string().url(),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  // AWS
  AWS_REGION: z.string().min(1),
  AWS_BUCKET_NAME: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),

  RAZORPAY_KEY: z.string().min(1, "RAZORPAY_KEY is required"),
  RAZORPAY_SECRET: z.string().min(1, "RAZORPAY_SECRET is required"),

});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(" Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
