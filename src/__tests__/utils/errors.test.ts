/**
 * Unit tests — shared/utils/errors.ts
 *   AppError, NotFoundError, UnauthorizedError, ValidationError, handleError
 *
 * Run: npx vitest run src/__tests__/utils/errors.test.ts
 */

import { describe, it, expect, vi } from "vitest";

// ── Mock the logger to prevent console noise ─────────────────────────────────
vi.mock("@/shared/utils/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

import {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  handleError,
} from "@/shared/utils/errors";

// ─────────────────────────────────────────────────────────────────────────────

describe("AppError", () => {
  it("sets message, name, and statusCode", () => {
    const err = new AppError("Something failed", 400);
    expect(err.message).toBe("Something failed");
    expect(err.statusCode).toBe(400);
    expect(err.name).toBe("AppError");
  });

  it("defaults to statusCode 400", () => {
    const err = new AppError("bad");
    expect(err.statusCode).toBe(400);
  });

  it("stores optional errors field", () => {
    const errors = { email: ["Invalid email"] };
    const err = new AppError("Validation", 422, errors);
    expect(err.errors).toEqual(errors);
  });

  it("is an instance of Error", () => {
    expect(new AppError("x")).toBeInstanceOf(Error);
  });
});

describe("NotFoundError", () => {
  it("has statusCode 404 and name NotFoundError", () => {
    const err = new NotFoundError();
    expect(err.statusCode).toBe(404);
    expect(err.name).toBe("NotFoundError");
    expect(err.message).toBe("Resource not found");
  });

  it("accepts a custom message", () => {
    const err = new NotFoundError("Shareholder not found");
    expect(err.message).toBe("Shareholder not found");
  });

  it("is an instance of AppError and Error", () => {
    const err = new NotFoundError();
    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(Error);
  });
});

describe("UnauthorizedError", () => {
  it("has statusCode 401 and name UnauthorizedError", () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
    expect(err.name).toBe("UnauthorizedError");
    expect(err.message).toBe("Unauthorized");
  });

  it("accepts a custom message", () => {
    const err = new UnauthorizedError("Token expired");
    expect(err.message).toBe("Token expired");
  });
});

describe("ValidationError", () => {
  it("has statusCode 422 and name ValidationError", () => {
    const errors = { email: ["Required"], password: ["Too short"] };
    const err = new ValidationError(errors);
    expect(err.statusCode).toBe(422);
    expect(err.name).toBe("ValidationError");
    expect(err.errors).toEqual(errors);
    expect(err.message).toBe("Validation failed");
  });

  it("accepts a custom message", () => {
    const err = new ValidationError({}, "Custom validation error");
    expect(err.message).toBe("Custom validation error");
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("handleError — AppError instances", () => {
  it("passes through AppError message and statusCode", () => {
    const result = handleError(new AppError("Custom error", 400));
    expect(result.message).toBe("Custom error");
    expect(result.statusCode).toBe(400);
  });

  it("passes through NotFoundError as 404", () => {
    const result = handleError(new NotFoundError("Not found"));
    expect(result.statusCode).toBe(404);
    expect(result.message).toBe("Not found");
  });

  it("passes through UnauthorizedError as 401", () => {
    const result = handleError(new UnauthorizedError());
    expect(result.statusCode).toBe(401);
  });

  it("passes through ValidationError with errors field", () => {
    const errors = { field: ["error"] };
    const result = handleError(new ValidationError(errors));
    expect(result.statusCode).toBe(422);
    expect(result.errors).toEqual(errors);
  });
});

describe("handleError — Mongoose ValidationError simulation", () => {
  it("maps Mongoose field errors to 422 with errors record", () => {
    // Simulate Mongoose ValidationError shape
    const mongoErr = Object.assign(new Error("Validation failed"), {
      name: "ValidationError",
      errors: {
        email: { message: "email is required" },
        name: { message: "name is too short" },
      },
    });

    const result = handleError(mongoErr);
    expect(result.statusCode).toBe(422);
    expect(result.message).toBe("Validation failed");
    expect(result.errors?.email).toEqual(["email is required"]);
    expect(result.errors?.name).toEqual(["name is too short"]);
  });
});

describe("handleError — Mongoose duplicate key (code 11000)", () => {
  it("returns 409 for duplicate key error", () => {
    const dupErr = Object.assign(new Error("E11000 duplicate"), {
      code: "11000",
    });
    const result = handleError(dupErr);
    expect(result.statusCode).toBe(409);
    expect(result.message).toMatch(/[Dd]uplicate/);
  });
});

describe("handleError — unknown errors", () => {
  it("returns 500 for plain Error objects", () => {
    const result = handleError(new Error("unexpected crash"));
    expect(result.statusCode).toBe(500);
    expect(result.message).toBe("Internal server error");
  });

  it("returns 500 for thrown strings", () => {
    const result = handleError("some string thrown");
    expect(result.statusCode).toBe(500);
    expect(result.message).toBe("Internal server error");
  });

  it("returns 500 for null thrown", () => {
    const result = handleError(null);
    expect(result.statusCode).toBe(500);
  });

  it("does NOT include stack trace in the message", () => {
    const err = new Error("crash");
    const result = handleError(err);
    expect(result.message).not.toContain("at ");
    expect(result.message).not.toContain("Error:");
  });
});
