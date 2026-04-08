import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { env } from "../../config/env";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom format for logs
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] ${level}: ${stack || message}`;
});

// Daily rotate transport
const dailyRotateTransport = new DailyRotateFile({
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: env.LOG_RETENTION_DAYS
    ? `${env.LOG_RETENTION_DAYS}d`
    : "30d",
});

// Separate error file with rotation
const errorRotateTransport = new DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  level: "error",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "10m",
  maxFiles: env.LOG_RETENTION_DAYS
    ? `${env.LOG_RETENTION_DAYS}d`
    : "30d",
});

// Create the logger instance
export const loggerInstance = winston.createLogger({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({ format: combine(colorize(), timestamp({ format: "HH:mm:ss" }), logFormat) }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    dailyRotateTransport,
    errorRotateTransport
  ],
});
