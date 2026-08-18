import { logger } from "@/shared/utils/logger";

export class AppError extends Error {
  public statusCode: number;
  public errors?: Record<string, string[]>;

  constructor(message: string, statusCode = 400, errors?: Record<string, string[]>) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ValidationError extends AppError {
  constructor(errors: Record<string, string[]>, message = "Validation failed") {
    super(message, 422, errors);
    this.name = "ValidationError";
  }
}

/** Safe messages that may be sent to clients for known error types */
const SAFE_STATUS_MESSAGES: Record<number, string> = {
  400: "Bad request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  422: "Validation failed",
  429: "Too many requests",
  500: "Internal server error",
};

/**
 * Normalise any thrown value into a safe { message, statusCode, errors } shape.
 *
 * - AppError subclasses: message is already intentional, pass through.
 * - Mongoose ValidationError: extract field messages, return 422.
 * - Unknown errors: log server-side, return generic 500 (no leak of stack traces).
 */
export function handleError(error: unknown): {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
} {
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      errors: error.errors,
    };
  }

  // Mongoose validation errors
  if (
    error instanceof Error &&
    error.name === "ValidationError" &&
    "errors" in error
  ) {
    const mongoErrors = (error as { errors: Record<string, { message: string }> }).errors;
    const fields: Record<string, string[]> = {};
    for (const [field, err] of Object.entries(mongoErrors)) {
      fields[field] = [err.message];
    }
    return { message: "Validation failed", statusCode: 422, errors: fields };
  }

  // Mongoose duplicate key (e.g. duplicate email)
  if (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "11000"
  ) {
    return { message: "Duplicate entry — record already exists", statusCode: 409 };
  }

  // Unknown — log internally, return generic message (no stack trace to client)
  logger.error("[handleError] Unhandled error:", error);
  return {
    message: SAFE_STATUS_MESSAGES[500],
    statusCode: 500,
  };
}
