import pino from "pino";

/**
 * Single shared logger instance for the entire application.
 *
 * Development  — pino-pretty formats output as readable, coloured text.
 * Production   — raw JSON written to stdout; log aggregators (Datadog,
 *                CloudWatch, Render logs, etc.) parse it automatically.
 *
 * Usage:
 *   import logger from "./config/logger.js";
 *   logger.info("Server started");
 *   logger.error({ err }, "[adminController] addDoctor failed");
 */
const isDev = process.env.NODE_ENV !== "production";

const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    // Rename pino's default "msg" key to "message" for friendlier log output
    messageKey: "message",
  },
  isDev
    ? pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:HH:MM:ss",
          ignore: "pid,hostname",
        },
      })
    : undefined, // production — write JSON to stdout
);

export default logger;
